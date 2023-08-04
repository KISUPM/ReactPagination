/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Select,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Products, ProductsData } from "./Types/Types";

import ReactPaginate from "react-paginate";

import classes from "./Paginate.module.css";
import { SearchIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { search } from "ss-search";
import PriceFilter from "./Components/PriceFilter";
interface IItemList {
  item: Products[];
}

interface IItemTable {
  itemsPerPage: number;
}

function App() {
  const [isFetching, setIsFetching] = useState(false);
  const [products, setProducts] = useState<Products[]>([]);
  const [searchResult, setSearchResult] = useState<Products[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const fetchData = async () => {
    setIsFetching(true);
    await fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((json) => {
        const data: ProductsData = json as ProductsData;
        setProducts(data.products);
        setSearchResult(data.products);

        const temp_cate: string[] = [];
        data.products.forEach(
          (i) => !temp_cate.includes(i.category) && temp_cate.push(i.category)
        );
        const temp_brands: string[] = [];
        setCategories(temp_cate);

        data.products.forEach(
          (i) => !temp_brands.includes(i.brand) && temp_brands.push(i.brand)
        );
        setBrands(temp_brands);
        // console.log(temp_brands);
      });
    setIsFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Items that want to show
  const ItemList: React.FC<IItemList> = (props) => {
    return (
      <Tbody>
        {props.item.map((product, index) => {
          return (
            <Tr key={index} _hover={{ bg: "rgb(0,0,0,0.1)" }} h="max-content">
              <Td textAlign={"center"}>{product.id}</Td>
              <Td textAlign={"center"}>
                <Image src={product.thumbnail} h="50px" m="auto" />
              </Td>
              <Td>{product.title}</Td>
              <Td textAlign={"center"}>{product.brand}</Td>
              {/*<Td>{product.description}</Td> */}
              <Td textAlign={"right"}>{product.price}$</Td>
              <Td textAlign={"center"}>{product.stock}</Td>
              <Td textAlign={"center"}>{product.rating}</Td>
              <Td textAlign={"center"}>{product.category}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const ItemTable: React.FC<IItemTable> = (props) => {
    const [firstItem, setFirstItem] = useState(0);
    const lastItem = firstItem + props.itemsPerPage;
    const currentItem = searchResult.slice(firstItem, lastItem);
    const pageCount = Math.ceil(searchResult.length / props.itemsPerPage);

    const onPageChange = (event: any) => {
      const newFirstItem =
        (event.selected * props.itemsPerPage) % products.length;
      window.scrollTo({ top: 0, behavior: "smooth" });
      setFirstItem(newFirstItem);
    };
    return (
      <>
        <VStack w="100%" h="35rem" justifyContent={"space-between"}>
          <Box overflowY={"auto"} h="30rem" w="100%">
            <Table
              h="max-content"
              border="1px solid black"
              position={"relative"}
            >
              <Thead h="max-content" position={"sticky"} top="0">
                <Tr bg="#228B22">
                  <Th color="#fff" textAlign={"center"} w="1rem">
                    id
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="5rem">
                    tumbnail
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="max-content">
                    title
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="5rem">
                    brand
                  </Th>
                  {/* <Th color="#fff" textAlign={"center"}>description</Th> */}
                  <Th color="#fff" textAlign={"right"} w="10rem">
                    price
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="5rem">
                    stock
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="5rem">
                    rating
                  </Th>
                  <Th color="#fff" textAlign={"center"} w="5rem">
                    category
                  </Th>
                </Tr>
              </Thead>
              <ItemList item={currentItem} />
            </Table>
          </Box>
          <HStack
            w="100%"
            h="max-content"
            justify={"space-between"}
            // m="1rem auto"
          >
            <ReactPaginate
              containerClassName={classes.container}
              nextLabel="next >"
              nextClassName={classes.nextBtn}
              previousLabel="< previous"
              previousClassName={classes.prevBtn}
              breakLabel="..."
              breakClassName={classes.breakLabel}
              activeClassName={classes.active}
              pageClassName={classes.page}
              onPageChange={onPageChange}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
            />
            <HStack>
              <Text>Items Per Page</Text>
              <Select
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                }}
                w="fit-content"
                value={itemsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Select>
            </HStack>
          </HStack>
        </VStack>
      </>
    );
  };

  const { watch, register } = useForm();

  const searchValue = watch("searchValue") || "";
  const category = watch("category") || "";
  const brand = watch("brand") || "";
  const max: number = 3000;
  const [lowest, setLowest] = useState(0);
  const [highest, setHighest] = useState(max);

  const onSearch = () => {
    const searchField = ["id", "title", "price", "brand", "category"];
    // const value = searchValue + " " + brand + " " + category;
    // console.log(value)
    const result = search(
      products,
      searchField,
      searchValue + " " + brand + " " + category
    ) as Products[];
    setSearchResult(
      result.filter((p) => p.price >= lowest && p.price <= highest)
    );
  };

  useEffect(() => {
    onSearch();
  }, [searchValue, category, lowest, highest, brand]);

  return (
    <Box p="1rem">
      <HStack>
        <InputGroup my="1rem" w="35%">
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input {...register("searchValue")} />
        </InputGroup>
        <Select w="fit-content" {...register("category")} defaultValue={""}>
          <option value="">All Categories</option>
          {categories.map((c, index) => {
            return (
              <option value={c} key={index}>
                {c}
              </option>
            );
          })}
        </Select>
        <Select w="fit-content" {...register("brand")}>
          <option value="">All Brand</option>
          {brands.map((b, index) => {
            return (
              <option value={b} key={index}>
                {b}
              </option>
            );
          })}
        </Select>
        <PriceFilter setHighest={setHighest} setLowest={setLowest} max={max} />
        <Button onClick={fetchData} isLoading={isFetching}>
          Reload
        </Button>
      </HStack>
      <ItemTable itemsPerPage={itemsPerPage} />
    </Box>
  );
}

export default App;
