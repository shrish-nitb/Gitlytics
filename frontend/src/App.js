import React from "react";
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
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    }
  });

  return tagFrequency;
};

const App = ({ data, userName }) => {
  const tagFrequency = countTagFrequency(data.repos);
  return (
    <Container style={{ padding: "1rem" }}>
      <TextField
        label="Search GitHub Repositories"
        fullWidth
        style={{
          marginBottom: "20px",
          position: "sticky",
          top: "5px",
          background: "white",
        }}
      />

      <Typography variant="h2" align="center" gutterBottom>
        {userName}
        <br />
        <img src={`http://ghchart.rshah.org/${userName}`} alt="Github chart" />
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(tagFrequency).map(([tag, count]) => (
          <Grid item key={tag}>
            <Badge badgeContent={count} color="error" invisible={count <= 1}>
              <Chip label={tag} />
            </Badge>
          </Grid>
        ))}
      </Grid>

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

export default App;
