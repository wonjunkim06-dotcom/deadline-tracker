#include <stdio.h>
#include <stdlib.h>




int main(){

int choice;
int num1, num2, result;
while(1){


    printf("\n---- Simple Calculator Program ---\n");
    printf("1 Addition\n");
    printf("w Subtraction\n");
    prinf("3 Multiplication\n");
    printf("4 Exit Program\n");
    printf("-------------------------\n");
    printf("Enter your choice:");

       if( scanf("%d", &choice) != 1){
        printf("Invalid input. Please enter numbers only\n");

        while(getchar() != '\n');
        continue;
       }       
    if( choice == 4){
        printf("Exiting the program...\n");
        break;
    }
    
    if(choice >= 1 && choice<= 3 )
{
    printf("ENter two numbers (ex: 10 20):");
    if( scanf("%d %d", &num1, &num2) != 2){
        printf("Invalid integerinput. Returning to main menu\n");
        while(getchar() != '\n');
        continue;
       }       
    if( choice == 4){
        printf("Exiting the program...\n");
        break;
    }
    
    if(choice >= 1 && choice<= 3 )
{
    printf("ENter two numbers (ex: 10 20):");
    if( scanf("%d %d", &num1, &num2) != 2){
        printf("Invalid integerinput. Returning to main menu\n");
        while(getchar() != '\n');
        continue;
    }
}    

    switch(choice){
        case 1: 
            result = num1 + num2;
            printf("Result: %d + %d = %d\n", num1, num2, result);
            break;
        case 2:
            result = num1 - num2;
            printf("Result: %d - %d = %d\n", num1, num2, result);
            break;
        case 3:
            result = num1 * num2;
            printf("Result: %d * %d = %d\n", num1, num2, result);
            break;
        default:
            printf("Invalid  choice. Please select a number between 1 and 4.\n");
            break;
    }
}
    return 0;

}

}




