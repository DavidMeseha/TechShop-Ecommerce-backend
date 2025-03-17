import { PipelineStage, Types } from 'mongoose';

const createUserCartAggregationPipeline = (userId: string) => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(userId) } },
    {
      $project: {
        cartSize: { $size: { $ifNull: ['$cart', []] } },
        cart: 1,
        addresses: 1,
        _id: 1,
      },
    },
    {
      $match: {
        $expr: { $gt: ['$cartSize', 0] },
      },
    },
    {
      $unwind: {
        path: '$cart',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'products',
        let: { productId: '$cart.product' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$productId'] },
            },
          },
          {
            $addFields: {
              isLiked: { $in: [userId, { $ifNull: ['$usersLiked', []] }] },
              isSaved: { $in: [userId, { $ifNull: ['$usersSaved', []] }] },
              isInCart: { $in: [userId, { $ifNull: ['$usersCarted', []] }] },
              isReviewed: { $in: [userId, { $ifNull: ['$usersReviewed', []] }] },
            },
          },
          {
            $project: {
              usersLiked: 0,
              usersSaved: 0,
              usersCarted: 0,
              usersReviewed: 0,
            },
          },
        ],
        as: 'productDetails',
      },
    },
    {
      $addFields: {
        'cart.product': { $arrayElemAt: ['$productDetails', 0] },
      },
    },
    {
      $group: {
        _id: '$_id',
        cart: { $push: '$cart' },
        addresses: { $first: '$addresses' },
      },
    },
    {
      $project: {
        _id: 1,
        cart: {
          $cond: {
            if: { $eq: [{ $arrayElemAt: ['$cart.product', 0] }, null] },
            then: [],
            else: '$cart',
          },
        },
        addresses: 1,
      },
    },
  ];

  return pipeline;
};

export default createUserCartAggregationPipeline;
