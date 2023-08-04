import {
  Box,
  Button,
  HStack,
  Input,
  //   Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  setLowest: (num: number) => void;
  setHighest: (num: number) => void;
  max: number;
}

const PriceFilter: React.FC<Props> = (props) => {
  const [lowest, setLowest] = useState(0);
  const [highest, setHighest] = useState(props.max);
  return (
    <Box>
      <Popover>
        <PopoverTrigger>
          <Button w="100px">
            {lowest} - {highest}
          </Button>
        </PopoverTrigger>
        <PopoverContent border="1px solid black">
          <Box p="1rem">
            <HStack w="100%" justify={"space-between"}>
              <Text textAlign={"left"}>Min</Text>
              <Text textAlign={"right"}>Max</Text>
            </HStack>
            <RangeSlider
              aria-label={["min", "max"]}
              defaultValue={[0, props.max]}
              min={0}
              max={props.max}
              step={25}
              size={"lg"}
              value={[lowest, highest]}
              onChange={(val) => {
                setLowest(val[0]);
                props.setLowest(val[0]);
                setHighest(val[1]);
                props.setHighest(val[1]);
              }}
              bg="white"
              m="0.25rem"
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} border={"1px solid blue"} />
              <RangeSliderThumb index={1} border={"1px solid blue"} />
            </RangeSlider>
            <HStack mb="0.25rem">
              <Text w="6rem">Lowest Price</Text>
              <Text>
                :{" "}
                <Input
                  p="0"
                  h="fit-content"
                  w="5rem"
                  min={0}
                  type="number"
                  textAlign={"right"}
                  value={lowest}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= highest) {
                      props.setLowest(highest);
                      setLowest(highest);
                    } else {
                      props.setLowest(value);
                      setLowest(value);
                    }
                  }}
                />
                $
              </Text>
            </HStack>
            <HStack>
              <Text w="6rem">Highest Price</Text>
              <Text>
                :{" "}
                <Input
                  p="0"
                  h="fit-content"
                  w="5rem"
                  type="number"
                  textAlign={"right"}
                  value={highest}
                  onBlur={(e) => {
                    if (Number(e.target.value) < lowest) {
                      setHighest(lowest);
                      props.setHighest(lowest);
                    }
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > props.max) {
                      setHighest(props.max);
                      props.setHighest(props.max);
                    } else {
                      setHighest(value);
                      props.setHighest(value);
                    }
                  }}
                />
                $
              </Text>
            </HStack>
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default PriceFilter;
