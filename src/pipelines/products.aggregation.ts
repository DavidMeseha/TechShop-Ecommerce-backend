import { PipelineStage } from 'mongoose';

function createProductsPipeline(
  id: string,
  page: number,
  limit: number,
  pipelineStages: PipelineStage[] = []
) {
  const pipeline: PipelineStage[] = [
    ...pipelineStages,
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendor',
        foreignField: '_id',
        as: 'vendor',
        pipeline: [
          {
            $addFields: {
              isFollowed: { $in: [id, { $ifNull: ['$usersFollowed', []] }] },
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
        from: 'tags',
        localField: 'productTags',
        foreignField: '_id',
        as: 'productTags',
      },
    },
    {
      $addFields: {
        vendor: { $arrayElemAt: ['$vendor', 0] },
        isLiked: { $in: [id, { $ifNull: ['$usersLiked', []] }] },
        isSaved: { $in: [id, { $ifNull: ['$usersSaved', []] }] },
        isInCart: { $in: [id, { $ifNull: ['$usersCarted', []] }] },
        isReviewed: { $in: [id, { $ifNull: ['$usersReviewed', []] }] },
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
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit + 1,
    },
  ];

  return pipeline;
}

export default createProductsPipeline;
