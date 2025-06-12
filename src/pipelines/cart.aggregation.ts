import { PipelineStage, Types } from 'mongoose';

const createCartPipeline = (userId: string) => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(userId) } },
    {
      $project: {
        cart: 1,
        addresses: 1,
        _id: 1,
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
        cart: {
          $push: {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$cart', null] },
                  { $ne: ['$cart.product', null] },
                  { $ne: ['$cart', {}] },
                ],
              },
              then: '$cart',
              else: '$$REMOVE',
            },
          },
        },
        addresses: { $first: '$addresses' },
      },
    },
    {
      $project: {
        _id: 1,
        cart: {
          $cond: {
            if: { $eq: [{ $size: '$cart' }, 0] },
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

export default createCartPipeline;
