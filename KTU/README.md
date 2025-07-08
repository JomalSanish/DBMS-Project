# Student-Teacher Management System (React Native)

This is a React Native mobile application designed to facilitate student and course management, including result updates and viewing. It offers distinct interfaces for teachers and students, secured by a login system.

## Table of Contents

- [Features](#features)
- [Libraries Used](#libraries-used)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
  - [Login Credentials](#login-credentials)
  - [Teacher Functionality](#teacher-functionality)
  - [Student Functionality](#student-functionality)
- [API Endpoint](#api-endpoint)
- [Contributing](#contributing)
- [License](#license)

## Features

This application provides the following core functionalities:

* **User Authentication**:
    * Secure login for both Teacher and Student roles.
    * Dynamic fetching of student IDs for login validation.
* **Teacher Dashboard**: A comprehensive interface for teachers to manage academic data.
    * **Student Management (`StudentScreen.tsx`)**:
        * Add new students with a unique 10-digit ID, name, and semester.
        * View a list of all registered students.
        * Delete existing student records.
    * **Course Management (`CourseScreen.tsx`)**:
        * Add new courses, specifying the semester they belong to.
        * View all courses associated with a selected semester.
        * Delete courses from the system.
    * **Result Management (`ResultScreen.tsx`)**:
        * Update marks for specific courses for individual students, filtered by semester.
        * Select students from a dynamically loaded list based on the chosen semester.
* **Student Dashboard (`StudentHomeScreen.tsx`)**:
    * View personal student information (Name, ID, Semester).
    * Display a list of courses and corresponding marks for their current semester.
* **Intuitive User Interface**:
    * Modern and clean design with an emphasis on ease of use.
    * Visual feedback for actions (alerts for success/error).
    * Password visibility toggle for enhanced user experience.
    * Engaging Lottie animation on the login screen.
    * Clear header navigation with a logout option.

## Libraries Used

The following key libraries and tools are used in this project:

* **`react`**: JavaScript library for building user interfaces.
* **`react-native`**: Framework for building native mobile apps using React.
* **`@react-navigation/stack`**: For stack-based navigation, managing screens in a stack.
* **`@react-navigation/bottom-tabs`**: For tab-based navigation, primarily used in the Teacher's home screen.
* **`react-native-vector-icons/Ionicons`**: Provides a vast collection of icons for a visually rich UI.
* **`@react-native-picker/picker`**: Enables native-style dropdown menus for selecting semesters and students.
* **`lottie-react-native`**: Integrates Lottie animations for a more dynamic and engaging user experience.
* **`expo`**: A set of tools and services for building, deploying, and quickly iterating on native iOS, Android, and web apps from the same JavaScript codebase.
* **`expo-router`**: File-system based router for Expo projects.
* **`typescript`**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.

## Installation and Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:

* Node.js (LTS recommended)
* npm or Yarn
* Expo CLI:
    ```bash
    npm install -g expo-cli
    # OR
    yarn global add expo-cli
    ```

### Steps

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL_HERE>
    cd <YOUR_REPOSITORY_NAME>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Start the Expo development server:**

    ```bash
    expo start
    ```

    This command will open a new tab in your browser with the Expo DevTools. You can then:
    * Scan the QR code with the **Expo Go** app on your mobile device (iOS or Android).
    * Run on an Android emulator.
    * Run on an iOS simulator (requires macOS and Xcode).

## Usage

### Login Credentials

* **Teacher Account**:
    * **ID**: `Teacher`
    * **Password**: `password`
* **Student Accounts**:
    * **ID**: Any 10-digit student ID that has been added to the system (e.g., `KTU1234567`).
    * **Password**: The student's own ID (e.g., `KTU1234567`).

### Teacher Functionality

Upon successful login as a teacher, you will be directed to the `TeacherHomeScreen` with three main tabs:

* **Student Tab**:
    * **Add Student**: Enter a 10-digit alphanumeric `Student ID`, `Name`, and select their `Semester` using the picker. Click "Add Student" to create the record.
    * **Fetch All Students**: Click "Fetch All Students" to populate a list of all registered students, displaying their Name and ID.
    * **Delete Student**: Next to each fetched student, a "Delete" button allows you to remove their record from the database.
* **Result Tab**:
    * **Select Semester**: Choose the academic semester for which you want to update results.
    * **Select Student**: A picker will display student IDs belonging to the selected semester. Choose the relevant student.
    * **Enter Marks**: For each course listed (dynamically fetched based on the selected semester), enter the student's mark in the respective input field.
    * **Update Marks**: Click "Update Marks" to submit the entered scores for the student.
* **Course Tab**:
    * **Select Semester**: Choose the semester for which you want to manage courses.
    * **Add Course**: Enter a `Course Name` and click "Add Course" to add it to the selected semester's curriculum.
    * **Delete Course**: All courses for the currently selected semester will be listed. A "Delete" button next to each course allows for its removal.

### Student Functionality

After logging in as a student, you will see your `StudentHomeScreen`. This screen displays:

* Your **Student Name**
* Your **Student ID**
* Your registered **Semester**
* A list of **Courses** and your corresponding **Marks** for that semester.

## API Endpoint

The application communicates with a backend API hosted on Render:

`https://dbms-project-l3ur.onrender.com`

Please ensure that this URL is accessible for the application to function correctly.

## Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).
