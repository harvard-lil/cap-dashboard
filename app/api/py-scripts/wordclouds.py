import os
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect()
# find all folders
command = "find /ftldata/wordclouds ! -name '*.png'"
stdin, stdout, stderr = ssh.exec_command(command)
filelist = stdout.read().splitlines()
for folder in filelist:
    # split by '/ftldata/wordclouds/'
    # return all but first
