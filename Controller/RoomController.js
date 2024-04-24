const Room = require('../model/RoomModel')

exports.addRoom = async (req,res)=>{
    let roomToAdd = new Room({
        roomNumber:req.body.roomNumber,
        roomType:req.body.roomType,
        description:req.body.description,
        price:req.body.price,
        capacity:req.body.capacity,
        availability: req.body.availability,
        room_image:req.file.path
    })
    roomToAdd = await roomToAdd.save()
    if(!roomToAdd){
       return res.status(400).json({error:"something went wrong"})
    }
    return res.send(roomToAdd)

}

//get all users
exports.getAllRooms = async (req,res)=>{
    let rooms = await Room.find()
    if(!rooms){
        return res.status(400).json({error:"something went wrong"})
    }
    return res.send(rooms)
}