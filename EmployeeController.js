const Cab = require('./CabModel');
const Employee = require('./employeeSchema');

// Function to calculate the distance between two coordinates using the Haversine formula
const calculateDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

// Controller function to distribute employees among cabs based on their distance to each other
const assignCabsToGroups = (employees, cabs) => {
    let remainingEmployees = [...employees];
    const groups = [];

    cabs.forEach(cab => {
        const group = {
            cabId: cab._id,
            employees: [],
            remainingCapacity: cab.seatingCapacity
        };

        for (let i = remainingEmployees.length - 1; i >= 0; i--) {
            const employee = remainingEmployees[i];
            if (group.remainingCapacity >= 1) {
                group.employees.push(employee);
                remainingEmployees.splice(i, 1);
                group.remainingCapacity--;
            }
        }

        groups.push(group);
    });

    return groups;
};

const findClosestEmployeeGroupByGeospatial = async (req, res) => {
    try {
        const { employeeId } = req.body; // Employee ID and desired group size

        // Find the coordinates of the employee with the given ID
        const sourceEmployee = await Employee.findById(employeeId);

        if (!sourceEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Find the closest groupSize employees including the source employee using $nearSphere query
        const closestEmployees = await Employee.find({
            coordinates: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: sourceEmployee.coordinates
                    }
                }
            }
        }).lean(); // Limit the number of results to groupSize

        // Sort the closest employees by distance from the source employee
        closestEmployees.sort((a, b) => {
            const distanceA = calculateDistance(sourceEmployee.coordinates, a.coordinates);
            const distanceB = calculateDistance(sourceEmployee.coordinates, b.coordinates);
            return distanceA - distanceB;
        });

        // Assuming you have fetched the available cabs from the database
        const availableCabs = await Cab.find().lean();

        // Assign cabs to groups of employees
        const groups = assignCabsToGroups(closestEmployees, availableCabs);

        res.json({ groups });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    findClosestEmployeeGroupByGeospatial,
};
