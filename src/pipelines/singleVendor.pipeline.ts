import { PipelineStage } from 'mongoose';

function createSingleVendorAggregationPipeline(userId: string, pipelineStage: PipelineStage) {
  const pipeline: PipelineStage[] = [
    pipelineStage,
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
  ];

  return pipeline;
}

export default createSingleVendorAggregationPipeline;
