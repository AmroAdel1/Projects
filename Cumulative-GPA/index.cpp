#include <iostream>
#include <vector>
#include <numeric>
#include <iomanip> // For setting precision

using namespace std;

// Structure to represent a course       // organize course data
struct Course {
    string name;
    int credits;
    double gradePoints;
};

// Function to convert letter grade to grade points
double getGradePoints(char grade) {
    switch (grade) {
        case 'A': return 4.0;
        case 'B': return 3.0;
        case 'C': return 2.0;
        case 'D': return 1.0;
        case 'F': return 0.0;
        default: return -1.0; // Invalid grade
    }
}

int main() {
    int numCourses;

    cout << "Enter the number of courses: ";
    cin >> numCourses;

    vector<Course> courses(numCourses);

    for (int i = 0; i < numCourses; ++i) {
        cout << "\nEnter details for course " << i + 1 << ":" << endl;
        cout << "Course Name: ";
        cin.ignore(); // Consume newline left by previous cin    // to consume the newline character left in the input buffer, preventing issues with getline later.
        getline(cin, courses[i].name);
        cout << "Credits: ";
        cin >> courses[i].credits;
        char grade;
        cout << "Grade (A, B, C, D, or F): ";
        cin >> grade;
        courses[i].gradePoints = getGradePoints(grade);

        while (courses[i].gradePoints == -1.0) {     // Input Validation
            cout << "Invalid grade. Please enter a valid grade (A, B, C, D, or F): ";
            cin >> grade;
            courses[i].gradePoints = getGradePoints(grade);
        }
    }

    // Calculate total credits and total grade points
    int totalCredits = 0;
    double totalGradePointsEarned = 0.0;

    cout << "\nCourse Summary:" << endl;           // Course Summary Table
    cout << "--------------------------------------------------" << endl;
    cout << setw(30) << left << "Course Name" << setw(10) << "Credits" << setw(10) << "Grade" << endl;
    cout << "--------------------------------------------------" << endl;


    for (const auto& course : courses) {
        totalCredits += course.credits;
        totalGradePointsEarned += course.credits * course.gradePoints;
        char gradeLetter;
        if (course.gradePoints == 4) gradeLetter = 'A';
        else if (course.gradePoints == 3) gradeLetter = 'B';
        else if (course.gradePoints == 2) gradeLetter = 'C';
        else if (course.gradePoints == 1) gradeLetter = 'D';
        else gradeLetter = 'F';

        cout << setw(30) << left << course.name << setw(10) << course.credits << setw(10) << gradeLetter << endl;   // Clearer Output

    }
    cout << "--------------------------------------------------" << endl;

    // Calculate CGPA
    double cgpa = (totalCredits == 0) ? 0.0 : totalGradePointsEarned / totalCredits;       // Handles Zero Credits

    cout << "\nTotal Credits: " << totalCredits << endl;
    cout << "Total Grade Points Earned: " << fixed << setprecision(2) << totalGradePointsEarned << endl;
    cout << "CGPA: " << fixed << setprecision(2) << cgpa << endl;

    return 0;
}