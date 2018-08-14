#include <stdio.h>
#include <stdlib.h>  // for exit, strtol

int factorial (int n)
{
	if (n == 1) 
		return 1;
	else
		return n*factorial (n-1);
}

int main(int argc, char *argv[]) {
    if ( argc != 2 ) {
    	printf("0");
		exit (1);
    } 

	int num;
	num = atoi (argv[1]);

	printf("%d", factorial(num) ); // output
    return 0;
}

