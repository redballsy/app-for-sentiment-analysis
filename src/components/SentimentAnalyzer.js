import React, { useState } from "react";
import { Button, Container, Typography, Grid } from "@mui/material";
import Papa from "papaparse";
import Sentiment from "sentiment";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SentimentAnalyzer() {
  const [sentimentCounts, setSentimentCounts] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          analyzeSentiments(results.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const analyzeSentiments = (reviews) => {
    const sentiment = new Sentiment();
    let positive = 0, negative = 0, neutral = 0;

    reviews.forEach((row) => {
      const { review } = row;
      if (review) {
        const result = sentiment.analyze(review);
        if (result.score > 0) positive++;
        else if (result.score < 0) negative++;
        else neutral++;
      }
    });

    setSentimentCounts({ positive, negative, neutral });
  };

  const chartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment Analysis",
        data: [
          sentimentCounts.positive,
          sentimentCounts.negative,
          sentimentCounts.neutral,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Sentiment Analysis Tool
      </Typography>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        <Grid item xs={12} md={6}>
          <Button variant="contained" component="label" fullWidth>
            Upload CSV
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </Button>
           <Typography variant="h5" align="center" gutterBottom>
        The file uploads must be in csv file and must contain a column called review.
      </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Bar data={chartData} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default SentimentAnalyzer;
