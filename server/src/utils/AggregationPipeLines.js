const monthlyPlanAggregation = (year) => [
  {
    $unwind: "$startDates",
  },
  {
    $match: {
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    },
  },
  {
    $group: {
      _id: {
        $month: "$startDates",
      },
      numTours: { $sum: 1 },
      tours: { $push: "$name" },
    },
  },
  {
    $sort: {
      numTours: -1,
    },
  },
  {
    $addFields: { month: "$_id" },
  },
  {
    $project: {
      _id: 0,
    },
  },
];

exports.monthlyPlanAggregation = monthlyPlanAggregation;
