import { PipelineStage } from 'mongoose';

function createVendorsAggregationPipeline(
  userId: string,
  page: number,
  limit: number,
  pipelineStages: PipelineStage[] = []
) {
  const pipeline: PipelineStage[] = [
    ...pipelineStages,
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
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit + 1,
    },
  ];

  return pipeline;
}

export default createVendorsAggregationPipeline;
