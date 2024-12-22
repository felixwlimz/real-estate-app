import React, {useEffect} from 'react'
import {View, Text, Image, TouchableOpacity, ScrollView, FlatList, Button, ActivityIndicator} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import {Card, FeaturedCard} from "@/components/Cards";
import Filters from "@/components/Filters";
import useGlobalContext from "@/lib/global-provider";
import seed from "@/lib/seed";
import {router, useLocalSearchParams} from "expo-router";
import {useAppwrite} from "@/lib/useAppwrite";
import {getLatestProperties, getProperties} from "@/lib/appwrite";
import NoResults from "@/components/NoResults";

const Explore = () => {

    const {user} = useGlobalContext()

    const params = useLocalSearchParams<{ query?: string, filter?: string }>()

    const {data: latestProperties, loading: isLoading} = useAppwrite({
        fn: getLatestProperties
    })

    const {data: properties, loading, refetch} = useAppwrite({
        fn: getProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 20
        },
        skip: true
    })

    const handleCardPress = (id: string) => {
        router.push(`/properties/${id}`)
    }

    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 6
        })
    }, [params.filter, params.query])

    return (
        <SafeAreaView className='bg-white h-full'>
            {/*<Button title="Seed" onPress={seed}>Seed</Button>*/}
            <FlatList
                data={properties}
                renderItem={({item}) => <Card item={item} onPress={() => handleCardPress(item.$id)}/>}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerClassName='pb-32'
                columnWrapperClassName='flex gap-5 px-5'
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={loading ? (
                    <ActivityIndicator size='large' className='text-primary-300 mt-5'/>
                ) : <NoResults/>}
                ListHeaderComponent={
                    <View className='px-5'>
                        <View className='flex flex-row items-center justify-between mt-5'>
                            <TouchableOpacity onPress={() => router.back()} className='flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center'>
                                <Image source={icons.backArrow} className='size-5'/>
                            </TouchableOpacity>
                            <Text className='text-base mr-2 text-center font-rubik-medium text-black-300'>Search for Your Ideal Home</Text>
                            <Image source={icons.bell} className='size-5'/>
                        </View>
                        <Search/>
                        <View className='mt-5'>
                            <Filters/>
                            <Text className='text-xl font-rubik-bold text-black-300 mt-5'>
                                Found {properties?.length} Properties
                            </Text>
                        </View>
                    </View>
                }
            />


        </SafeAreaView>
    )
}

export default Explore