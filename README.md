# -EmployeeLocMap
Employee Location Distance Calculator
# Employee Location Distance Measurement Project

This project allows you to calculate and display the distance between the residence and workplace addresses of employees on an interactive map. Users can enter location coordinates for each employee, and the map displays each address in unique colors with distance information along the lines.

Employee: Refers to the employees in an organization.
Loc: Short for "location," suggesting a focus on the physical location or specific position of employees.
Map: Likely refers to a visual or data representation of employee locations, possibly on a geographic map or in a spatial arrangement (e.g., within an office layout).

## Features

- Input fields for entering the coordinates (latitude and longitude) of residence and workplace addresses for each employee
- Display each employee’s residence and workplace addresses in different colors on the map
- Draw a line between residence and workplace locations, showing the distance (in kilometers) above the line
- Option to add and delete employees, with all distance and location data updated dynamically

## Requirements

This project uses the [Leaflet](https://leafletjs.com/) library to display map data. An internet connection is required to load Leaflet and the map tiles.

## Installation

To run this project locally, follow these steps:

1. Clone or download the project files to your local machine.
2. Ensure you have the `index.html`, `style.css`, and `script.js` files in the project folder.
3. Open `index.html` in a web browser to launch the application.

## Usage

1. Enter the `Employee Name`, `Residence Latitude`, `Residence Longitude`, `Workplace Latitude`, and `Workplace Longitude` coordinates in the respective fields.
2. Click the `Add` button to add a new employee.
3. Click the `Show` button to display residence and workplace addresses on the map, with a line indicating the distance.
4. The distance (in kilometers) between the residence and workplace will appear above the line in a consistent color for clarity.
5. Click the `Delete` button next to an employee's name to remove them from the map.

## Contributing

Contributions to improve this project are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## License

This project is licensed under the MIT License. For more details, see the `LICENSE` file.
