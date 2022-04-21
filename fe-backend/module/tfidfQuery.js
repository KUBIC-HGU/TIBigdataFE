const express = require("express");
const router = express.Router();
const Keywords = require("../models/tfidf");

router.get("/", (req, res) => {
  Keywords.findOne().exec((res) => {
    res.send(res);
  });
});

router.get("/test", (req, res) => {
  console.log("work!");
  let id = "5f65aececd17436ac6436f4a";
  Keywords.findOne({ hash_key: id }, (error, val) => {
    if (error) {
      console.log(error);
    }
    console.log(val);
    res.json(val);
  });
});

/**
 * @description 받은 id 혹은 id list에 대해 그 문서의 tfidf 값을 반환해준다.
 */
function getKeyVal(req, res) {
  console.log("tfidf/getKeyVal");
  let ids = req.body["id"];
  console.log("ids : ", ids);

  if (typeof ids == "string")
    //only send one string
    matchQuery = { hash_key: ids };
  //when send string array
  else matchQuery = { hash_key: { $in: ids } };

  let isVal = req.body["isVal"]; //tfidf 값에 해당하는 키워드를 반환할 때 tfidf 값도 함께 반환할 것인지 파악.

  //tfidf 테이블에서 몇개의 핵심 단어들을 반환할지 결정.  undefined 으로 넘어오면 default 5를 반환해준다.
  let num = req.body["num"]; //could be undefined.
  // console.log("get req");
  // console.log(ids);
  if (num == undefined) num = 5;
  else num = parseInt(num);

  //use aggragation
  Keywords.aggregate(
    [
      { $match: matchQuery },
      // { $addFields : { keywords : }},
      {
        $project: {
          tfidf: {
            $slice: ["$tfidf", num, num], //3번째 elemnt(왼쪽 param)까지 3개만큼(right param)
          },
        },
      },
      {
        $unwind: "$tfidf", //array을 풀어서 하나의 array으로 만든다.
      },
      {
        $project: {
          tfidf: {
            $cond: {
              if: isVal,
              then: "$tfidf",
              else: { $arrayElemAt: ["$tfidf", 0] },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          tfidf: { $addToSet: "$tfidf" },
        },
      },
    ],
    (err, docs) => {
      console.log("getKeyVal result: ");
      if (err) console.log(err);
      // console.log(docs)
      res.json(docs);
    }
  );
}

router.post("/getKeyVal", getKeyVal);

module.exports = router;
