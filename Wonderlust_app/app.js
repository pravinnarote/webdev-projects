const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");  
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Create MongoDB database connection
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}


app.listen(8080, () => {
    console.log('server listening to port 8080!!');
});
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//index route.
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
});

//create new listings.
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//post route
app.post("/listings", async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id", async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//show route.
app.get("/listings/:id", async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: "1200",
//         location: "calangute, goa",
//         country: "India",
//     });

//     try {
//         await sampleListing.save();
//         console.log("sample was saved");
//         res.send("successful testing");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error saving the listing");
//     }
// });


