import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { pipeline } from 'stream';
import { MyPipelineAppStage } from './stage';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CiCdAwsPipelineDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName : 'TestPineline',
      synth : new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('peterdt123/AWS-CodePipeline', 'main'),
        commands: ['npm ci',
                   'npm run build',
                   'npx cdk synth']
      }),
    });

    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: {account: "056093334675", region: "us-west-2"}
    }));

    testingStage.addPost(new ManualApprovalStep('Manual approval before production'));

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: {account: "056093334675", region: "us-west-2"}
    }));

  }
}
