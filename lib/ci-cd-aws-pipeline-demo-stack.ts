import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
//import { MyPipelineAppStage } from './stage';
import { pipeline } from 'stream';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CiCdAwsPipelineDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName : 'TestPineline',
      synth : new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('peterdt123/AWS-CodePipeline', 'main'),
        commands: ['npm ci',
                   'npm run build',
                   'npx cdk synth']
      }),
    });
  }
}
