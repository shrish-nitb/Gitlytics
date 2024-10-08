const express = require("express");
const axios = require("axios");
require("dotenv").config();
var cors = require("cors");

const app = express();
const port = 3020;

app.use(cors())

app.get("/github-info", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "GitHub username is required" });
    }

    const userData = await make(username);

    res.json(userData);
  } catch (error) {
    
      res
      .status(500)
      .json({ error: "Internal Server error" });
    

  }
});

async function getData(URL) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: URL,
    headers: {
      Authorization: process.env.GITHUB_TOKEN,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  const response = await axios.request(config);
  return response.data;
}

function make(profile) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getData("https://api.github.com/users/" + profile);
      let repos = [];

      const userRepos = await getData(
        "https://api.github.com/users/" + profile + "/repos"
      );

      for (const repo of userRepos) {
        if (!repo.fork) {
          const repoData = {
            name: repo.name,
            link: repo.svn_url,
            tags: [...repo.topics, repo.language],
          };

          let branches = await getData(repo.url + "/branches");

          for (const { name } of branches) {
            let tree = (await getData(repo.url + "/git/trees/" + name +"?recursive=true")).tree;

            for (const { path, url } of tree) {
              if (path.includes("package.json")) {
                let packageJson = await getData(url);
                let pobj = JSON.parse(atob(packageJson.content));
                repoData.dependencies = {
                  ...pobj.dependencies,
                  ...pobj.devDependencies,
                };
              }
            }
          }

          repos.push(repoData);
        }
      }

      resolve({
        contributions: (
          await axios.request({
            url: "https://github-contributions-api.jogruber.de/v4/" + profile,
          })
        ).data.total,
        publicRepos: user.public_repos,
        createdRepos: repos.length,
        repos: repos,
      });
    } catch (error) {
      reject(error);
    }
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
