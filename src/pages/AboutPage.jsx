import { Container, Typography, Box, Link, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

export default function AboutPage() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        About What to Watch
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to What to Watch! Our web app allows you to create an account,
        maintain a list of movies you have finished watching, and keep a
        want-to-watch list. Based on your preferences, we will also provide
        suggestions for your next movie to watch.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you encounter any issues or have suggestions, please let us know by
        creating an issue on our GitHub page:&nbsp;
        <Link
          href="https://github.com/michaeljohndan/nlp-movie-generator/issues"
          target="_blank"
          rel="noopener"
        >
          GitHub page
        </Link>
        .
      </Typography>
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Creators
        </Typography>
        <Box mt={2}>
          <Typography variant="h6" component="h3">
            John Lee
          </Typography>
          <Typography variant="body1" paragraph>
            <Link
              href="https://github.com/michaeljohndan/"
              target="_blank"
              rel="noopener"
            >
              John Lee
            </Link>
            &nbsp;is studying Computer Science and Applied Mathematics at
            Vanderbilt University. John also enjoys studying machine learning
            and web development, with focuses on frontend technologies. He hopes
            to become a software developer or a product manager and has a
            passion for learning new things and meeting new people. Contact him:
            <Link
              href="https://www.linkedin.com/in/johnjaemin/"
              target="_blank"
              rel="noopener"
            >
              <IconButton>
                <EmailIcon />
              </IconButton>
            </Link>
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" component="h3">
            Max Mercado
          </Typography>
          <Typography variant="body1" paragraph>
            <Link
              href="https://github.com/maxmerc"
              target="_blank"
              rel="noopener"
            >
              Max Mercado
            </Link>
            &nbsp;is a developer and student at the University of Pennsylvannia
            studying computer science with minors in mathematics and data
            science. Max enjoys working on projects that involve machine
            learning and data analysis but has a passion for movies. He aspires
            to be a software engineer or quantitative devloper / trader and is
            always looking for new opportunities to learn and grow. Contact him:
            <Link
              href="https://www.linkedin.com/in/max-mercado-568a50273/"
              target="_blank"
              rel="noopener"
            >
              <IconButton>
                <EmailIcon />
              </IconButton>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
