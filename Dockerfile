FROM ubuntu:18.04
LABEL mantainer="Francesco Fattori f.fattori4@studenti.unipi.it"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

#install essentials
RUN apt-get update
RUN apt-get install -y --no-install-recommends python3 python3-pip python3-setuptools
RUN apt-get install -y --no-install-recommends wget


#install go-IPFS
RUN wget https://dist.ipfs.io/go-ipfs/v0.8.0/go-ipfs_v0.8.0_linux-amd64.tar.gz
RUN tar -xvzf go-ipfs_v0.8.0_linux-amd64.tar.gz
RUN cd go-ipfs && bash install.sh
RUN ipfs init

#install python3
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip

#copy IPFSDownloadAnalyzer files
RUN mkdir /app
COPY static /app/static
COPY templates /app/templates
COPY *.py /app
COPY *.txt /app
RUN mkdir /app/downloads

#install requirements
WORKDIR /app
RUN pip3 install -r requirements.txt

EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

