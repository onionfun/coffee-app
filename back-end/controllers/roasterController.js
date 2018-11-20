const router = require('express').Router();
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY
});
const Roaster = require('../models/Roaster');

router.get('/', async(req, res, next)=>{
    try{
        
    }catch(err){
        next(err);
    }
})

router.get('/search', async(req, res, next) => {
    try{
        googleMapsClient.geocode({
            address: req.query.location
        }, (err, response)=>{
            if(err){
                next(err)
            }else{
                console.log(response.json)
                console.log("-----------")
                console.log(response.json.results[0].geometry.location);
                googleMapsClient.places({
                    query: req.query.query + "coffee roaster",
                    location: response.json.results[0].geometry.location
                }, (err, response) => {
                    if(err){
                        next(err);
                    }else{
                        const creationPromises = response.json.results.map((result)=>{
                            const thisRoaster = {
                                name: result.name
                            }
                            return Roaster.findOrCreate(thisRoaster);
                        })
                        Promise.all(creationPromises).then((roasters)=>{
                            console.log(roasters)
                        })
                    }
                })
            }
        })
    }catch(err){
        next(err);
    }
})

module.exports = router