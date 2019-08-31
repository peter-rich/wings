#!/bin/sh
SAMPLE_ID=$1
INPUT_BAMS_FOLDER=$2
REF_CHROMOSOMES_FILEPATH=$3
OUT_DIR=$4
#If the file name for the bam files follow this pattern - gs://gbsc-gcp-project-abz_disease/Variants/alignment_bams/Sample1_A04/Sample1-DNA_A04.recalibrated.bam, follow the code below else modify accordingly
export OMP_NUM_THREADS=2
mkdir "${SAMPLE_ID}_100bin"
mkdir "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files"
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root" -chrom 1 2 3 4 -tree ${INPUT_BAMS_FOLDER} -unique && \
##Histogram step provide directory with chromosome fasta files and genome name though they are optional
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root" -chrom 1 2 3 4 -his 100 -d "${REF_CHROMOSOMES_FILEPATH}" > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.his" && \
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root" -chrom 1 2 3 4 -stat 100  > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.stats" && \
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root" -chrom 1 2 3 4 -eval 100  > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.eval" && \
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root" -chrom 1 2 3 4 -partition 100  > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.partition" &&\
cnvnator -root "${SAMPLE_ID}_100bin/${SAMPLE_ID}_100bin_intermediate_files/my.root"  -chrom 1 2 3 4 -call 100  > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_bin100_CNVs.out" &
##Wait for all background processes running in parallel to complete
wait
#Generate final VCF for genome
perl /opt/build/CNVnator_v0.3.3/cnvnator2VCF.pl "${SAMPLE_ID}_100bin/${SAMPLE_ID}_bin100_CNVs.out" > "${SAMPLE_ID}_100bin/${SAMPLE_ID}_bin100_CNVs.vcf"
cp -r "${SAMPLE_ID}_100bin" "${OUT_DIR}"