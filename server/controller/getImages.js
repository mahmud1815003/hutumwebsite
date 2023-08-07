const { imageModel, imageYearsModel } = require("../models/mainModels");
const axios = require("axios");
const moment = require("moment");
const {unlink} = require('fs');
const path = require('path');

const getYear = async (req, res, next) => {
  try {
    const data = await imageYearsModel
      .find({})
      .sort({ year: -1 })
      .select("-_id");
    res.status(200).json(data);
  } catch (error) {
    next(error.message);
    console.log(error);
  }
};

const getImageByYear = async (req, res, next) => {
  try {
    const { year, page: pageNumber } = req.body;
    console.log(req.body);
    const pageSize = 12;
    const data = await imageModel
      .find({ year: year })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select("-_id");
    res.status(200).json(data);
  } catch (error) {
    next(error.message);
    console.log(error);
  }
};

const photoUploader = async (req, res, next) => {
  try {
    const { name, place, description, date, roll, caption } = req.body;
    await axios.post(
      `https://api.telegram.org/bot${process.env.telapi}/sendPhoto`,
      {
        chat_id: process.env.photoGroup,
        photo:
          "https://bmeboss.files.wordpress.com/2023/08/20230319_154404-01.jpeg",
        caption: `Name: ${name}\nRoll: ${roll}\nCaption: ${caption}\nPlace: ${place}\nDescription: ${description ? description : ''}\nDate: ${moment(date).format('MM/DD/yyyy')}\n`,
      }
    );
    // unlink(path.join(__dirname, `../util/${req.files[0].filename}`), (err) => {
    //   if(err){
    //     console.log(err);
    //   }
    // })
    res.status(200).send({
      msg: "Image Sent Successfully",
    });
  } catch (error) {
    next(error.message);
    console.log(error);
  }
};

module.exports = {
  getYear,
  getImageByYear,
  photoUploader,
};
