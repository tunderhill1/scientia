<div align="center">
  <a href="https://www.scientia.doc.ic.ac.uk">
    <img src="https://scientia.doc.ic.ac.uk/images/logo.svg" height="96">
    <div align="center">
      <h3>Scientia</h3>
    </div>
  </a>
  <div align="center">A Unified DoC EdTech Platform</div>
</div>

---

Spearheaded by the [DoC EdTech Lab](https://edtech.pages.doc.ic.ac.uk/), Scientia is a platform that focuses on ehancing the remote learning experience for staff and students alike.

# Tech Stack

- 🛠 [nvm](https://github.com/nvm-sh/nvm) for managing different Node versions [recommended]

- Node 16
- React & Typescript for the baseline
- [Radix UI](https://www.radix-ui.com/) for unstyled accessible components
- [Stitches](https://stitches.dev/) for styling
- [Bootstrap Icons](https://icons.getbootstrap.com/) for... well, icons
- [Yarn](https://yarnpkg.com/) for dependency management


# Running the app in dev

> Make sure that the project folder sits next to the [Materials](https://gitlab.doc.ic.ac.uk/edtech/materials), [Emarking](https://gitlab.doc.ic.ac.uk/edtech/emarking) and [ScientiaAPI](https://gitlab.doc.ic.ac.uk/edtech/scientia-api) project folders. 

To make sure that cookies are sent correctly from the backend and stored correctly in the client, we use a docker-compose
stack with an Nginx reverse proxy (pretty much what we use in production -just with simpler configs).

```shell
docker-compose -f dev.docker-compose.yml up [--build]
docker exec $(docker ps -qf "name=materials" | head -n1) flask create_all
docker exec $(docker ps -qf "name=materials" | head -n1) flask setup_clean_dev_env
docker exec $(docker ps -qf "name=emarking" | head -n1) flask create_all
docker exec $(docker ps -qf "name=emarking" | head -n1) flask setup_clean_dev_env
```

The stack so-composed (pardon the pun) should allow for hot-reload in both Scientia and Materials (as the respective services' source codes are attached as volumes).
The only caveat is for the NGINX configuration: on changing it, you should also reload NGINX:

```shell
docker exec $(docker ps -qf "name=proxy" | head -n1) nginx -s reload
```


# Running tests locally

After `yarn install`, go for `yarn test`.
