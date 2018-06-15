# Team Manager

This app is created for organizations to have their own hub and homepage for their team or subteams, without having to clutter inboxes with emails or spam chats.

Currently the main features are:

* Creating organizations
* Inviting users
* Inviting admins
* Creating announcements (that disappear after a week)
* Creating events where users can take attendance
* Tracking user attendance and who attended a meeting

# Idea

This idea came after my extracurricular team (iGEM) got way too many subteams and we all had a need for using different tools, like Slack, Email, Trello, Google Drive. I wanted to start alleviating this problem somehow, because it was just so disorganized. This proof of concept idea was one of the ideas my group's final project, but we all decided to go with something else, so I took the idea and made it for my project 4.

# How to use

Currently it's self explanatory to log in and create an organization. When you make an organization, you are automatically made an admin (and you cannot demote yourself from being an admin).

Once in the organization, you can see current announcements within the past week. If you're an admin, you can see an admin panel where you can make announcements, add other admins, or add new users. You can also choose to demote admins to regular users.

There is also an events page, where you can attend events that are created within the past three hours. Admins can create events, see who attended an event, and see how many events a user has attended.

# Features to expand on in the future

* Remove a user from an organization
* Leave an organization
* Nicer UI (not a designer D:)
* More visualization of who attended events
* Invite certain users to certain events
* Categorize users by subteam (will eliminate the need to make multiple organizations per subteam)
* Better email handling
* Better authentication page

# Last notes

All in all, I'm happy with how the application came out. While I didn't put in all the features I wanted to, I have gained enough experience with React and Router to be able to add in a new feature within a couple hours. Creating this application and planning where all the data was stored, and how to connect it all together took over 20 hours of programming and refactoring code. I wanted to finish this project early to maximize the amount of time I had to work on the group project. I used a lot of the authentication code created in class (both for authentication and form input), but other than that the code is entirely my own.
