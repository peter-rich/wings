# Wings: one-stop orchestration app

Stanford Center for Genomics and Personalized Medicine

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Set-up

Pull the latest code base into a working folder of your choosing
```bash
# Skip the this line if git is already installed
sudo apt install git-all -yq
# Pull project
git clone https://github.com/StanfordBioinformatics/wings.git wings
cd wings
git checkout master
```
Run the setup script
```bash
sh setup.sh
```
Start the container
```bash
# Choose a port on the host machine that you want to run the application on
sudo docker run --rm -d -p <PORT_ON_HOST>:8081 --name wings_web wings_scgpm
# if you using a GCP instance, use the default public port: 80
sudo docker run --rm -d -p 80:8081 --name wings_web wings_scgpm
```
Now the wings application should be up and running at `<HOST_IP>/<PORT_ON_HOST>`.

## Running the tests

To be added

### Break down into end to end tests

To be added

### And coding style tests

[![NPM Version][npm-image]][npm-url]

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* Front-end style : [Materalize CSS](https://materializecss.com/)
* Front-end framework : [React.js](https://reactjs.org/), [Redux](https://redux.js.org/)
* Back-end: [Node.js](https://www.nodejs.org/)
* Docker: [Docker](https://www.docker.com/)

## Authors

* **Lek Tin** - [Lek Tin](https://github.com/lek-tin)
* **Zhanfu Zhang** - [Zhanfu Zhang](https://github.com/peter-rich)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
To be added

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki