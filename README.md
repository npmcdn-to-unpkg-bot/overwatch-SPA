# ![](http://i.imgur.com/YZ4w2ey.png) Overwatch - Looking For Group App: Single Page App

## Overview
Overwatch is a team based first person shooter game that allows users to choose from one of four categories (attack, defence, tank and support). The idea of the game is to create a balanced team between damage, healing, defence and tanks. The key to winning is a strong team. As this game is slowly becoming the next big E-Sports game I decided to make a single page app that allows users to enter their player details to post a request to form a team. The idea is that with the stats of the players and forming a balanced team you can have a better chance at winning.

### Side Note on Speed

As a side note, this is a new game. The API i'm using is an official one as Blizzard hasn't released their API yet. It pulls current data but it's rather slow and requires to fetches (using promise.all) to get all the data I wanted. So appologies if it's a bit slow loading!


### Collecting User Details

The way the app works is it collects some input from the user:

- Battle Net ID (to select the player you want data from)
- The platform that user plays on (between pc, playstation and xbox),
- The region you play on (between American servers and Europe servers)
- The Game mode (currently overwatch has quick-play and competitive modes)
- And any notes to tell players what you're looking for


I then collect this data through the delegate function on button click. It uses all of the data the user gives to create the url's needed for the fetch of the API.

### Rendering the Data

Since this is an unofficial API i'm using it's split up the data I want into two URL's. Since i'm using Firebase to push the results and therefore render the data into a row, I need the data to be pulled as one fetch and one push (as splitting it into two fetches and two pushes causes a double render with half the data in each). So to solve this I used promise.all() to fetch both of the URL's inside an array.

Now that the data is collected and pushed, it triggers the .on function from Firebase. This triggers when anything has been added,removed,updated to firebase and will re render based on the action.

The render works by calling the data that's stored in firebase inside a state.users array. Each render is given the key stored in firebase which allows me to edit and delete these specific rows that have been rendered.


- User icon
- User Name
- Level
- Games Won
- Time Played
- What mode you want to play
- Your notes made

All of this data is stored in firebase. I chose this data to be easily presented in a table and hope it helps users make a decision on who to choose on their team.

### Deleting Data

To delete the data/row that's rendered, I create a getKeyFromClosestElement() function that finds the closest key based on a delegate key click function. With that data I can then remove the specific data based on the firebase key found.

### Updating Data

As the update feature, I've added a checkbox to update when a user has found a group. This alters a simple bit of text "show" or "hide" which is stored inside of a class. It overlays a big green tick over their icon to indicate they've found a group.

### Time Posted Feature

As an added feature i've added a time since posted function. At the time of rendering i capture the current date using new Date().getTime() / 1000 (second part to turn it into epoch number instead of date format which is needed for the function). The function then compares the current time to the time that the post was created. This is then rendered in either: Seconds, Minutes, Hours or Years since the post was created.

---

## Next Features I Will Add

As this is a work in progress, the next steps i'd like to do is to create a login function for two reasons. This will allow only that user to post their own characters data. This will also limit which posts they can delete. I'd also like to add more functionallity to form a group of people inside the SPA by selecting posts to see your formed team of 6.

I'd also ideally like to create a chat function between users. This way users can talk to each other and communicate how to join up in game.
