# DrawSpace - Modern Monorepo Sample

client

- profile edit
- content mocks
- responsive
- modal
- cra template
- deno starter

server

-

The Assignment

Create a drawing web application that allows users to draw/sketch on an empty piece of “paper”
and upload it to a public list of drawings.

Each uploaded drawing will be saved in a persistence layer of your choosing on the backend.
IMPORTANT NOTE: The drawings should not be persisted as bitmaps. This is important for
dealing with different display sizes and for keeping the original data instead of a bitmap
representation.

Screens
Login/Register
Provide a very simple login/register mechanism.

Main
This screen is the public list of drawings that all users uploaded. Information that should be
present for each drawing:

- Creation date & time.
- Time it took to draw (from first stroke to sending the drawing).
- Thumbnail of the drawing itself.
- show the user’s details
- allow a user to delete their drawings

Create

- The user should be able to choose colors (at least five).
- The user should be able to change the brush’s stroke width.
- There should be a special “Eraser” brush.
- The user can choose whether this drawing is public (goes in the list) or private (and then
  they can share the URL with whoever they want).
  You should create both the frontend (ReactJS) and the backend (Node.js). Avoid using a library
  that will do all the drawing. You can choose any other technology in your stack. The application
  should have an API layer that it communicates with. Frontend and backend should be
  separated.

Major Bonus Points
We would love to see as much of these features implemented. Although they are not required,
they can greatly boost the assignment’s standard.

1. “Record” the drawing and “Replay” it at will
   When creating a drawing, record the drawing through time and allow other users (in the
   list and/or the drawing page) to “play” the drawing. The result should be as if a user
   remotely sees the creator creating the drawing themselves.
2. Handle Retina displays
   Show Retina users sharp drawings.
3. Provide a good mobile experience
   The application should work nicely on (modern) mobile devices both for consumption
   (viewing the list and specific drawings) and for creation (creating a drawing).
4. Make the strokes smooth and pleasing to the eye
   Try to make the strokes very smooth.
5. More Brush types
   Provide more brush types! :)
   README
   Write a README to accompany the code. It should address the following:
   ● General architecture of the application.
   ● Reasoning behind main technical choices.
   ● Things you didn't implement or trade-offs you made. This can also include details about
   how you would implement things differently if you were to spend more time on the
   assignment or if it was for production use.
   Feel free to add any more details.
   Good luck!
