import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { useState } from "react";
import ImageGrid from "../../components/ImageGrid";
import {
  useGetImagesByYearMutation,
  useGetYearsQuery,
} from "../../redux/endPoints/image/image";
import { useSelector } from "react-redux";
import CircularProgrssBar from "../../components/CircularProgrssBar";

const ImageHome = () => {
  const theme = useTheme();
  const { data: yearData, isLoading, isError } = useGetYearsQuery();
  const [getImagesByYear, { data: images, isLoading: allLoading }] =
    useGetImagesByYearMutation();
  const [value, setValue] = useState({});

  useEffect(() => {
    if (value !== null) {
      getImagesByYear({
        year: value.year,
        page: value.page,
      });
    }
  }, [value]);

  useEffect(() => {
    if (yearData) {
      setValue({ ...yearData[0], page: 1 });
    }
  }, [yearData]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
  return (
    <Box m={"1.5rem 1rem"} pt={"2.8rem"}>
      {!isLoading ? (
        <FlexBetween>
          <Header key={"1815003"} title={"Beauties of KUET"} />
          <Autocomplete
            disableClearable={true}
            disablePortal
            id="combo-box-demo"
            options={yearData}
            sx={{
              width: !isMobile ? 250 : 150,
            }}
            value={value}
            onChange={(e, newValue) =>
              setValue({
                ...newValue,
                page: 1,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Year"
                InputLabelProps={{
                  style: {
                    color: theme.palette.text.primary,
                    fontSize: "1rem",
                  },
                }}
              />
            )}
          />
        </FlexBetween>
      ) : (
        <Box width={"100%"} height={"90vh"}>
          <CircularProgrssBar />
        </Box>
      )}
      {value && <ImageGrid year={value.year} />}
      <Box
        width={"100%"}
        py={"1rem"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <LoadingButton
          onClick={() =>
            setValue((prev) => {
              return {
                ...prev,
                page: prev.page + 1,
              };
            })
          }
          size="large"
          startIcon={<Refresh />}
          loading={allLoading}
          variant="contained"
        >
          More
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ImageHome;