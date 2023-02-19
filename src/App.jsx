import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
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
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [tokenAdresses, setTokenAddresses] = useState([]);
  const [loggedIn, setLoggedIn] = useBoolean();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  async function getNFTsForOwners() {
    setLoading(true);
    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    let userName = userAddress;
    if (userAddress.endsWith(".eth")) {
      userName = await alchemy.core.resolveName(userAddress);
    } else if (!ethers.utils.isAddress(userAddress)) {
      alert("Please enter a valid address!");
      setLoading(false);
      return;
    }

    const data = await alchemy.nft.getNftsForOwner(userName);
    setResults(data);

    const tokenDataPromises = [];
    const tokenAddressArray = [];

    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      tokenDataPromises.push(tokenData);
      tokenAddressArray.push(data.ownedNfts[i].contract.address);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setTokenAddresses(tokenAddressArray);
    setHasQueried(true);
    setLoading(false);
  }

  async function getUserTokenBalance() {
    setUserAddress(user);
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
        setUserAddress={setUserAddress}
        setResults={setResults}
        getNftsForOwners={getNFTsForOwners}
      />
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
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
          onClick={getNFTsForOwners}
          mt={36}
          colorScheme={"blue"}
        >
          Fetch NFTs
        </Button>

        <Heading color="grey" my={10}>
          NFTs owned by above address:
        </Heading>
        {loading ? (
          <Spinner />
        ) : (
          hasQueried && (
            <Collapse in={hasQueried} animateOpacity>
              {results.ownedNfts[0] ? (
                <SimpleGrid w={"90vw"} columns={4} spacing={18}>
                  {results.ownedNfts.map((e, i) => {
                    return (
                      <Flex
                        flexDir={"column"}
                        color="white"
                        w={"20vw"}
                        key={e.id}
                      >
                        <Card maxW="sm" minH="sm" boxShadow="base">
                          <CardBody>
                            <Image
                              src={
                                tokenDataObjects[i].rawMetadata.image
                                  ? tokenDataObjects[i].rawMetadata.image
                                  : "https://miro.medium.com/max/809/1*P76zSkbmtDcOwJGxPU7nqQ.jpeg"
                              }
                              alt={tokenDataObjects[i].symbol}
                              borderRadius="lg"
                              w="100%"
                            />
                            <Stack mt="6" spacing="3">
                              <Heading size="md">
                                {tokenDataObjects[i].symbol}
                              </Heading>
                              <Text color="blue.200" fontSize="md">
                                {tokenDataObjects[i].contract.name}
                              </Text>
                              <Text color="blue.600" fontSize="xl">
                                <b>{tokenDataObjects[i].title}</b>
                              </Text>
                            </Stack>
                          </CardBody>
                          <Divider color="lightgrey" />
                          <CardFooter>
                            <ButtonGroup spacing="2">
                              {tokenDataObjects[i].contract.address ? (
                                <Button variant="ghost" colorScheme="blue">
                                  <Link
                                    isExternal
                                    href={
                                      "https://etherscan.io/address/" +
                                      tokenDataObjects[i].contract.address
                                    }
                                  >
                                    View NFT Contract &nbsp;{" "}
                                    <ExternalLinkIcon />
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  colorScheme="blue"
                                  isDisabled
                                >
                                  <Link
                                    isExternal
                                    href={tokenDataObjects[i].rawMetadata.image}
                                  >
                                    No Contract Found!!
                                  </Link>
                                </Button>
                              )}
                            </ButtonGroup>
                          </CardFooter>
                        </Card>
                      </Flex>
                    );
                  })}
                </SimpleGrid>
              ) : (
                <Heading size="lg" color="grey" my={10}>
                  No NFTs found :(
                </Heading>
              )}
            </Collapse>
          )
        )}
      </Flex>
    </Box>
  );
}

export default App;
