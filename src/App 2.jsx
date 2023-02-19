import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
  useBoolean,
  Collapse,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import NavBar from "./components/NavBar";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";
import { useState } from "react";

function App() {
  const [queryAddress, setQueryAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [tokenAdresses, setTokenAddresses] = useState([]);
  const [loggedIn, setLoggedIn] = useBoolean();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  async function getTokenBalance() {
    setLoading(true);
    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    let userName = queryAddress;
    if (queryAddress.endsWith(".eth")) {
      userName = await alchemy.core.resolveName(queryAddress);
    } else if (!ethers.utils.isAddress(queryAddress)) {
      alert("Please enter a valid address!");
      setLoading(false);
      return;
    }
    const data = await alchemy.core.getTokenBalances(userName);

    setResults(data);
    const tokenDataPromises = [];
    const tokenAddressArray = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
      tokenAddressArray.push(data.tokenBalances[i].contractAddress);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setTokenAddresses(tokenAddressArray);
    setHasQueried(true);
    setLoading(false);
  }

  async function getUserTokenBalance() {
    setQueryAddress(user);
    console.log(user);
    await getTokenBalance();
  }

  return (
    <Box w="100vw" bg="#F7FAFC">
      <NavBar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        user={user}
        setUser={setUser}
        getUserTokenBalance={getUserTokenBalance}
        setHasQueried={setHasQueried}
        setQueryAddress={setQueryAddress}
      />
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setQueryAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
          placeholder="enter an address..."
        />
        <Button
          fontSize={20}
          onClick={getTokenBalance}
          mt={36}
          colorScheme={"blue"}
        >
          Get Token Balances
        </Button>

        <Heading my={10}>ERC-20 token balances:</Heading>
        {loading ? (
          <Spinner />
        ) : (
          hasQueried && (
            <Collapse in={hasQueried} animateOpacity>
              <SimpleGrid w={"90vw"} columns={4} spacing={24}>
                {results.tokenBalances.map((e, i) => {
                  return (
                    <Flex
                      flexDir={"column"}
                      color="white"
                      // bg="blue"
                      w={"20vw"}
                      key={e.id}
                    >
                      <Card maxW="sm" minH="sm" boxShadow="base">
                        <CardBody>
                          <Image
                            src={
                              tokenDataObjects[i].logo
                                ? tokenDataObjects[i].logo
                                : "https://miro.medium.com/max/809/1*P76zSkbmtDcOwJGxPU7nqQ.jpeg"
                            }
                            alt={tokenDataObjects[i].symbol}
                            borderRadius="lg"
                            h="100px"
                          />
                          <Stack mt="6" spacing="3">
                            <Heading size="md">
                              {tokenDataObjects[i].symbol}
                            </Heading>
                            <Text color="blue.600" fontSize="2xl">
                              <b>Balance:</b>&nbsp;
                              {
                                Utils.formatUnits(
                                  e.tokenBalance,
                                  tokenDataObjects[i].decimals
                                ).substring(0, 7) +
                                  (Utils.formatUnits(
                                    e.tokenBalance,
                                    tokenDataObjects[i].decimals
                                  ).length > 7
                                    ? "..."
                                    : "")
                                // ,
                                // console.log(tokenDataObjects[i])
                              }
                            </Text>
                          </Stack>
                        </CardBody>
                        <Divider color="lightgrey" />
                        <CardFooter>
                          <ButtonGroup spacing="2">
                            <Button variant="ghost" colorScheme="blue">
                              <Link
                                isExternal
                                href={
                                  "https://etherscan.io/token/" +
                                  tokenAdresses[i]
                                }
                              >
                                View Token &nbsp; <ExternalLinkIcon />
                              </Link>
                            </Button>
                          </ButtonGroup>
                        </CardFooter>
                      </Card>
                    </Flex>
                  );
                })}
              </SimpleGrid>
            </Collapse>
          )
        )}
      </Flex>
    </Box>
  );
}

export default App;
