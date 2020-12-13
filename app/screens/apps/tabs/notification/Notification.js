import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { myError, listRouteNotif } from "../../../../utils/MyUtil";
import { apiGet } from "../../../../services/api";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import { whiteColor } from "../../../../services/constant";
import ItemNotification from "./ItemNotification";
import MySeparator from "../../../../components/MySeparator";
import MyEmpty from "../../../../components/MyEmpty";
import AppTabContext from "../../AppTabContext";
import AppContext from "../../../../../AppContext";

const path_api = "notifications";

const Notification = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState([]);
    const { fromReceivedNotif } = useContext(AppContext);
    const ctxtab = useContext(AppTabContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            init();
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    useEffect(() => {
        if (fromReceivedNotif) {
            init();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromReceivedNotif])

    const init = async () => {
        setLoading(true);
        try {
            const result = await apiGet(path_api +
                "?page=1" +
                "&per_page=20"
            );
            setDatas(result.data);
            if (result.meta) {
                ctxtab.setCountBadge(result.meta.pagination.total);
            }else{
                ctxtab.setCountBadge(0);
            }
            setLoading(false);
        } catch (error) {
            setDatas([]);
            setLoading(false);
            myError(error, navigation);
        }
    }

    const onRefresh = () => {
        init();
    }
    const onPressNotif = async (value) => {
        setLoading(true);
        try {
            const resultNotifUpdate = await apiGet("notifications/"+value.id);
            if (resultNotifUpdate.status) {
                const result = await apiGet(path_api +
                    "?page=1" +
                    "&per_page=20"
                );
                setDatas(result.data);
                if (result.meta) {
                    ctxtab.setCountBadge(result.meta.pagination.total);
                }else{
                    ctxtab.setCountBadge(0);
                }
                setLoading(false);
                if (listRouteNotif.includes(value.redirect_mobile)) {
                    navigation.navigate(value.redirect_mobile);
                }
            }else{
                setLoading(false);
            }
            
        } catch (error) {
            setDatas([]);
            setLoading(false);
            myError(error, navigation);
        }
    }

    return (
        loading ? <MyLoadingCenter /> :
            <SafeAreaView style={styles.container}>
                <FlatList
                    ItemSeparatorComponent={MySeparator}
                    data={datas}
                    renderItem={({ item }) =>
                        <ItemNotification
                            heading={item.heading}
                            title={item.title}
                            content={item.content}
                            onPress={() => onPressNotif(item)}
                        />
                    }
                    refreshing={loading}
                    onRefresh={onRefresh}
                    contentContainerStyle={datas.length === 0 && styles.centerEmptySet}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={loading ? null : MyEmpty}
                />

            </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor
    },
    centerEmptySet: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
});
export default Notification;