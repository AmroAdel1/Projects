#include <iostream>
#include <cstdlib> // For rand() and srand()
#include <ctime>   // For time()
#include <string>

using namespace std;

int main() {
    srand(time(0));         // Seed the random number generator.  Random Number Generation: Uses srand(time(0)) to seed the random number generator, ensuring different random numbers each time the program runs.
    string choices[] = {"Rock", "Paper", "Scissors"};        // Array of choices.  Array for Choices: Stores the choices ("Rock", "Paper", "Scissors") in an array, making the code more readable and easier to maintain. String Use: Uses strings instead of individual characters, making the code more readable.

    while (true) {      // Game Loop: Implements a while loop to allow the user to play multiple rounds until they choose to exit.
        cout << "\nEnter your choice (0: Rock, 1: Paper, 2: Scissors, -1 to exit): ";
        int userChoice;
        cin >> userChoice;

        if (userChoice == -1) {        //Exit Option: Added an exit option using -1 as input.
            cout << "Exiting the game. Thanks for playing!" << endl;
            break; // Exit the loop if the user enters -1
        }

        if (userChoice < 0 || userChoice > 2) {    //Input Validation: Checks for invalid user input (numbers outside the range 0-2 and other data types) and prompts the user to re-enter a valid choice.
            cout << "Invalid choice. Please enter 0, 1, or 2." << endl;
            continue; // Go to the next iteration of the loop
        }

        int computerChoice = rand() % 3; // Generates a random number between 0 and 2

        cout << "You chose: " << choices[userChoice] << endl;
        cout << "Computer chose: " << choices[computerChoice] << endl;

        // Determine the winner
        if (userChoice == computerChoice) { cout << "It's a tie!" << endl; } 
        else if ((userChoice == 0 && computerChoice == 2) || // Rock vs Scissors
                 (userChoice == 1 && computerChoice == 0) || // Paper vs Rock
                 (userChoice == 2 && computerChoice == 1)) { // Scissors vs Paper
            cout << "You win!" << endl;    //Clearer Output: Provides more user-friendly output, clearly displaying the user's and computer's choices and the result of the game.
        } 
        else { cout << "Computer wins!" << endl; }    //Clearer Win Conditions: The win conditions are now more concise and easier to understand.
    }
    return 0;
}