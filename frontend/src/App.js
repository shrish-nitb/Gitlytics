
import { useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Link,
  Chip,
  TextField,
  Badge,
} from "@mui/material";

const countTagFrequency = (repos) => {
  const tagFrequency = {};

  repos.forEach((repo) => {
    if (repo.tags) {
      repo.tags.forEach((tag) => {
        if (typeof tag == "string")
          tagFrequency[tag.toLowerCase()] =
            (tagFrequency[tag.toLowerCase()] || 0) + 1;
      });
    }
  });

  return tagFrequency;
};

const ResultCard = ({ data, userName, status }) => {
  if (status != "Ready") {
    return (
      <Container style={{ textAlign: "center" }}>
        <Typography variant="subtitle" gutterBottom>
          {status}
        </Typography>
      </Container>
    );
  }
  const tagFrequency = countTagFrequency(data.repos);
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        {userName}
      </Typography>
      <br />
      <div style={{
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    flexWrap: "nowrap",
      }}>
        <div style={{
   flexGrow:1,
      }}>
          {" "}
          <img
            src={`http://ghchart.rshah.org/${userName}`}
            alt="Github chart"
          />
          <Grid container spacing={2}>
            {Object.entries(tagFrequency).map(([tag, count]) => (
              <Grid item key={tag}>
                <Badge
                  badgeContent={count}
                  color="error"
                  invisible={count <= 1}
                >
                  <Chip label={tag} />
                </Badge>
              </Grid>
            ))}
          </Grid>
        </div>
        <img
          src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userName}`}
          alt=""
        />
      </div>
      <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
        <Typography variant="h4" gutterBottom>
          Contributions Over the Years
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(data.contributions).map(([year, count]) => (
            <Grid item key={year}>
              <Typography variant="h6">{year}</Typography>
              <Typography variant="body1">Count: {count}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h4" gutterBottom>
        Repositories
      </Typography>
      <Grid container spacing={3}>
        {data.repos.map((repo) => (
          <Grid item key={repo.name} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Link
                  href={repo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="h5" component="div">
                    {repo.name}
                  </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  Tags: {repo.tags.join(", ")}
                </Typography>

                {repo.dependencies && (
                  <div>
                    <Typography variant="subtitle2" gutterBottom>
                      Dependencies: {Object.keys(repo.dependencies).join(", ")}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export function App() {
  const [UserName, setUserName] = useState("");
  const [info, setInfo] = useState({});
  const [showResults, setShowResults] = useState(
    "Please write your Github profile URL and Hit Enter"
  );

  const fetchData = async () => {
    try {
      setShowResults("Loading");
      const response = await axios.request({
        url: `https://githubviewerngrg.onrender.com/github-info?username=${(UserName.toLowerCase().split("/"))[UserName.split("/").indexOf('github.com')+1]}`,
      });
      setInfo(response.data);
      setShowResults("Ready");
    } catch (error) {
      setShowResults(error.message);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await fetchData();
    }
  };

  return (
    <>
      <TextField
        label="github.com/<username>"
        fullWidth
        style={{
          marginBottom: "20px",
          position: "sticky",
          top: "10px",
          background: "white",
          zIndex: 100001,
        }}
        value={UserName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {<ResultCard userName={(UserName.split("/"))[UserName.toLowerCase().split("/").indexOf('github.com')+1]} data={info} status={showResults} />}
    </>
  );
}
