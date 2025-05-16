import { PipelineStage } from 'mongoose';

function createVendorPipeline(userId: string, pipelineStage: PipelineStage[]) {
  const pipeline: PipelineStage[] = [
    ...pipelineStage,
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

export default createVendorPipeline;
