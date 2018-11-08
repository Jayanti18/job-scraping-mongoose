# job-scraping-mongoose
Scraping for job opening using mongoose



Use Cheerio to grab the site content and Mongoose to save it to your MongoDB database. 
This app goes to zip recuriter website and scrapes all the jobs that are available for the matching parameters of(Job = web develober) in concord NC with in 25miles of radius. 

Once user clicks on any displayed job, it opens a window where addition notes could be enter and referenced letter (still working on this part).
 
Source code
1. Models
    Article.js
    index.js
    Note.js
2. Public
    app.js
3. views
    index.handlebars
    layouts
        main.handlebars
4. server.js
5. key NPM packages.
    Express, express-handlebars, mongoose, cheerio, axios.





Author: Jayanti Singh
BootCamp -- 2018