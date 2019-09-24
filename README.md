# Project Title
Stanford Center for Genomics and Personalized Medicine

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Set-up
```bash
git checkout master
git pull
sh setup.sh
docker run --rm -d -p <PORT_ON_HOST>:8081 --name wings_web <DOCKER_IMAGE_ID>
```
Now go to `<HOST_IP>/<PORT_ON_HOST` to use the deployed app.

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