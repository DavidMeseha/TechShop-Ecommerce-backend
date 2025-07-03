import { PipelineStage } from 'mongoose';

function createProductPipeline(userId: string, pipelineStage: PipelineStage): PipelineStage[] {
  const pipeline: PipelineStage[] = [
    pipelineStage,
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendor',
        foreignField: '_id',
        as: 'vendor',
        pipeline: [
          {
            $addFields: {
              isFollowed: { $in: [userId, { $ifNull: ['$usersFollowed', []] }] },
            },
          },
          {
            $project: {
              usersFollowed: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'customer',
              foreignField: '_id',
              as: 'customer',
            },
          },
          {
            $unwind: '$customer',
          },
          {
            $project: {
              product: 1,
              customer: 1,
              reviewText: 1,
              rating: 1,
            },
          },
        ],
        as: 'productReviews',
      },
    },
    {
      $addFields: {
        vendor: { $arrayElemAt: ['$vendor', 0] },
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
  ];

  return pipeline;
}

export default createProductPipeline;
