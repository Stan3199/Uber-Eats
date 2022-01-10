import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Accordion.css";
export const AccordionHOC = (props) => {
	return (
		<Accordion className="accordion-main" defaultExpanded={true}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography>{props.title}</Typography>
			</AccordionSummary>
			<AccordionDetails >
				<Typography className="accodion__content">{props.children}</Typography>
			</AccordionDetails>
		</Accordion>
	);
};
