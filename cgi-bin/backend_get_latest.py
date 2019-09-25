if message == "" and state1 == 1:
  str_data_1 = form.getvalue("data_1")
  time_zone = form.getvalue("time_zone")
  bucket_id = form.getvalue("bucket_id")
  input_file = form.getvalue("input_file")
  fn = form.getvalue("fn")
  environment="/var/www/cgi-bin/tmp/"+fn
  os.putenv("GOOGLE_APPLICATION_CREDENTIALS", environment)
  os.putenv("MY_PROJECT", str_data_1)
  os.putenv("MY_BUCKET_PATH", bucket_id)
  os.putenv("LOGS", bucket_id + "/CNVnator-logs")
  os.putenv("OUTDIR", bucket_id + "/CNVnator-output/*")
  os.putenv("INPUT_FILES_PATH", input_file)
  cmd3 = 'dsub \
      --project "${MY_PROJECT}" \
      --zones "us-west1-*" \
      --logging "${LOGS}" \
      --disk-size 500 \
      --name "cnvnator-sample-50bin" \
      --env SAMPLE_ID="Sample1_A04" \
      --input INPUT_BAMS_FOLDER="${INPUT_FILES_PATH}" \
      --input-recursive REF_CHROMOSOMES_FILEPATH="${MY_BUCKET_PATH}/CNVnator-chrom" \
      --output-recursive OUT_DIR="$(dirname "${OUTDIR}")" \
      --image vandhanak/cnvnator:0.3.3 \
      --script /var/www/cgi-bin/tmp/CNVnator_SingleSample1_100bin.sh \
      --min-ram 40 \
      --min-cores 2'
  status, output3 = commands.getstatusoutput(cmd3)
  cmd4 = 'dstat --provider google-v2 --project ' + str_data_1 + ' --jobs ' + output3[4:38] + '--status \'*\''
  status, output4 = commands.getstatusoutput(cmd4)
  message="Successfully submit CNV"