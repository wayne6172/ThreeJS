#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    FILE *fp = fopen("data.txt","rb");

    if(fp == NULL){
        fclose(fp);
        fp = fopen("data.txt","wb");

        bool isTurn[2] = {true,true};
        fwrite(isTurn,sizeof(bool),2,fp);
        fclose(fp);

        fp = fopen("data.txt","rb");
    }

    bool isTurn[2];
    fread(isTurn,sizeof(bool),2,fp);

    if(argc == 1){
        printf("%d %d",isTurn[0],isTurn[1]);
    }
    else if(argc == 2){
        fclose(fp);

        fp = fopen("data.txt","wb");
        isTurn[atoi(argv[1])] = !isTurn[atoi(argv[1])];
        fwrite(isTurn,sizeof(bool),2,fp);
    }

    fclose(fp);

    return 0;
}
