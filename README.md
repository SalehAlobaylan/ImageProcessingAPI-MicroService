            How to use

-to start the server run this script:
    npm run img

-then go to this URL (You can customize it):
    http://localhost:3000/placeholder?image=DMASO1.jpg&width=400&height=400

-To check the code quality with prettier use this sciprt:
    npm run pret
-To check the code quality with Eslint use this script:
    npm run lint

-To test the code with jasmine run this script:
    npm run test

  
            Summary

Finaly after more than three weeks with wokrking on this project I hope it works correctly now.

regretfully, there is not much changes pushed to github,
and that because i did the project in many different ways
due to lack of information i did miss:
first time i built the project with Typescript and express.js but the images i built it with HTML 
and found a way to link it with the express server after i done, then i remembered that udacity said i should build it with only typescript
so i tried to search for another way to display the image without using anything execpt typescript i found a way with using fs and path libraries that i can reach and access the images. 

the second time i didn't notice the readme file on github for the project so i built the URL customization sizes with a way that use svg images,
when i found that there is a readme file in github that udacity made tells me that i should use a library called sharp, then i start over again
and learning how to do it with this library
the last time i didn.t notice the video of the demo for this project so i didn't understand the project description when it talk about storing the sizes of images 
so i did a few failed attempts until i saw the demo project video 




            the project
 
 So now let talk about the project 
this project is for placing an image in an express server 
and resizing the image through the url link 
then store a copy with that exact copy that size in the url 
so when you put that stored size again the load on the server will not be heavy
so that reduce the amount of the load and make it load faster

            Unit testing

after building this project I test it with jasmine library
I build a three test 
one for testing the endpoint
and the second for testing it default sizes
and the third one is testing it for the specific sizes 
and all of them should return the status and the image type correctly
