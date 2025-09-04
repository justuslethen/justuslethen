## Learn Cards V1.2

[Visit Learn Cards](https://learn-cards.justuslethen.de)  

Learn Cards is a web app that allows you to **learn vocabulary** or other card-based content **created by anyone**.  

### Login  
When you first visit the page, you will see a login box.  
At the bottom of this box, there is a button that takes you to the registration page, where you can create a new user account.  
You can choose a username and set a password with at least six characters. Your password is **securely** stored as a **hashed** version.  

Once you have successfully created an account, you will be redirected to the login page, where you can now log in with your new credentials. Simply enter your username and password to access your account.  

---

### Learning the Cards  
Once logged in, you will always land on a page displaying a list of all available cards.  
At the top, there is a red button that takes you to the learning page.  

On the **learning page**, you will see the front of a card, and your task is to guess what is on the back. For example, if you are learning vocabulary, the front side might display a Latin word, and you must guess its German translation.  

When you click the button to reveal the back of the card, you will see the correct answer. Below the card, there are two buttons. You can now decide whether your guess was correct or incorrect by clicking the corresponding button. The next card will then appear, and you can continue learning.

---

### The way the app knows which card to choose  
If you have guessed a vocab right, it will be **upgraded to the next level**. Based on the level, the card will be asked again in a few days or weeks. When the time is up and you have guessed it correctly again, **the level increases again**.  

Once you have learned every card for the day, you have the option to stop learning or continue and get other random cards. If you guess one wrong, no matter what level it is, it will directly **downgrade to level 0** and will be asked again the next day.  

---

### Add cards  
Everyone can add a card to the deck. Via the blue button at the top of the homepage, you can open the page to create a new card.  

There you have three input fields: one for the card name and two for the front and back. By clicking the submit button at the bottom, your card will be created and added to the deck. If the name is already taken, you will need to try again with a different name.  

---

### Admins  
The server host can add admins by editing and executing the `config_admin.py` script.  
Every admin can access the **admin page**, which contains links to **admin-only** sections:  

- A page displaying a list of **all users** with a button to delete them  
- A page with **all cards** and a button to delete them  
- The **userdata** page, which contains a table with columns like "username," "user_id," "card_id," "level," "value," and "date." This data tracks every user's card status and learning history.  

This data will be used for an algorithm I will build in the future that can pick the most relevant card to learn at any given moment.
By replacing "all" with a specific user_id, you can access only their learning data.


### Versions

V1: First version
V1.1: new styles and admin page
V1.2: add folders
