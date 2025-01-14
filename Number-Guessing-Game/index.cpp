#include <iostream>
#include <cstdlib>
#include <ctime>
#include <limits> // Required for numeric_limits

using namespace std;

class NumberGuessingGame {      // Object-Oriented Structure    // encapsulate the game logic
private:
    int secretNumber;
    int guess;
    int numGuesses;
    int maxGuesses;
    int minRange;
    int maxRange;

public:
    NumberGuessingGame(int min, int max, int maxTries) : minRange(min), maxRange(max), maxGuesses(maxTries) {       // Constructor
        srand(time(0)); // Seed the random number generator       // Random Number Generation
        secretNumber = rand() % (maxRange - minRange + 1) + minRange;
        numGuesses = 0;
    }

    bool play() {
        cout << "I'm thinking of a number between " << minRange << " and " << maxRange << "." << endl;   // Clearer Output

        while (numGuesses < maxGuesses) {
            cout << "Take a guess: ";

            // Input validation to prevent crashes from non-numeric input such as letters..
            if (!(cin >> guess)) {
                cout << "Invalid input. Please enter a number." << endl;
                cin.clear(); // Clear error flags
                cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Discard bad input
                continue; // Ask for input again
            }

            numGuesses++;

            if (guess < secretNumber) {
                cout << "Too low!" << endl;
            } else if (guess > secretNumber) {
                cout << "Too high!" << endl;
            } else {
                cout << "Congratulations! You guessed the number in " << numGuesses << " tries." << endl;
                return true; // Player won
            }
        }

        cout << "You ran out of guesses. The number was " << secretNumber << "." << endl;
        return false; // Player lost
    }
};

int main() {
    int minRange, maxRange, maxGuesses, prizeMoney;

    cout << "Welcome to the Number Guessing Game!" << endl;

    cout << "Enter the minimum number: ";
    cin >> minRange;
    cout << "Enter the maximum number: ";
    cin >> maxRange;
    cout << "Enter the maximum number of guesses: ";
    cin >> maxGuesses;

    NumberGuessingGame game(minRange, maxRange, maxGuesses);
    game.play();

    return 0;
}