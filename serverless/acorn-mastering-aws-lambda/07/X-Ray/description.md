- `$ aws cloudformation package --template-file template.yaml --s3-bucket neverlish-lambda --output-template-file output.yaml`
- `$ aws cloudformation deploy --template-file output.yaml --stack-name MyCalcSAMDeployment`
- 생성된 람다 함수에 '활성 추적' 옵션 선택