# Project description \- "Escape from Sector 9" Software Engineering Uni group project

---

## Context:

CS230 Software Engineering Coursework, Autumn 2025, team of 7 (allocated by department) 

## Tools

Java, JavaFX, Scene Builder/FXML, Git, GitHub, UML

## Task

Design and implement a JavaFX-based reimagining of the 1997 tile-based puzzle video game Jewel Chase, as a two-part group assignment: an object-oriented design (UML, class structure, level file format) followed by a fully coded implementation. 

The brief specified core mechanics (colour-based tile movement, three NPC types with distinct AI behaviours, items including loot/bombs/gates/levers, player profiles, save/load, and per-level high score tables) but left theming, class design, and the level file format entirely up to the group.

## Process

Requirements analysis Broke down the functional specification into the core systems that needed designing: tile movement rules, NPC behaviour (Flying Assassin, Floor Following Thief, Smart Thief), item interactions, win/lose conditions, and the level file format.  
Design phase (Assignment 1\) As a team we designed the object-oriented class structure and hierarchies for the game, alongside a custom level file format for storing tile layouts, NPC starting data, and level timers. I contributed the main menu UML.  
Team leadership I led the team throughout — running bi-weekly check-ins, assigning tasks, and supporting a non-native English speaker to contribute effectively. Weekly contribution breakdowns and minutes were a required part of the assignment structure, which I helped keep consistent and well-documented.  
Implementation (Assignment 2\) Built out the design in JavaFX. I wrote the in-game GUI screens using Scene Builder and FXML, fixing layout and interaction issues as they came up during testing, and managed the shared codebase through Git and GitHub throughout.  
Testing Tested UI screens and interactions as they were implemented, catching and fixing layout/interaction bugs.

## Result

We delivered a working implementation covering the core specified gameplay — tile-based movement, NPC behaviour, items, and win/lose conditions — with music included for atmosphere. As a team, we didn't get everything working to the standard we wanted: save/load, the high score table, and some NPC behaviour had bugs or gaps by submission, and we didn't add extra features beyond the spec.

## Reflections

Leading a 7-person team was the main challenge — keeping everyone aligned, making sure a non-native English speaker had what they needed to contribute fully, and keeping the group's process (minutes, task tracking, contribution breakdowns) actually useful rather than just a formality. On the technical side, the biggest lesson was around design precision — some of our early class/file-format decisions caused avoidable friction later in implementation, which reinforced how much a good design phase saves you during the build. I'm proud of how the team held together and communicated despite that, and of the GUI work I built directly.  
