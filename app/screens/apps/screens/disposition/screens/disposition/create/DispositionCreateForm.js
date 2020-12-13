import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Modal, Platform, TouchableOpacity, FlatList, Text, ScrollView, Alert } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { whiteColor, primaryColor, warningColor, successColor } from "../../../../../../../services/constant";
import { Grid, Col } from "react-native-easy-grid";
import MyPanel from "../../../../../../../components/MyPanel";
import MyButton from "../../../../../../../components/MyButton";
import MyInputOutlined from "../../../../../../../components/MyInputOutlined";
import moment from "moment";
import { SearchBar } from "react-native-elements";
import MyEmpty from "../../../../../../../components/MyEmpty";
import MySeparator from "../../../../../../../components/MySeparator";
import { apiGet } from "../../../../../../../services/api";
import { myError } from "../../../../../../../utils/MyUtil";
import MyLoading from "../../../../../../../components/MyLoading";
import MyPanelPress from "../../../../../../../components/MyPanelPress";
import MySimpleButton from "../../../../../../../components/MySimpleButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyHeader from "../../../../../../../components/MyHeader";
import { Picker } from "@react-native-community/picker";
import ItemAssign from "../ItemAssign";
import ItemIncomingMailDisposition from "../ItemIncomingMailDisposition";
import { useNavigation } from "@react-navigation/native";

function InfoText({
    title,
    content
}) {
    return (
        content ?
            <View style={{
                flexDirection: 'column'
            }}>
                <View>
                    <Text style={{ fontSize: 14 }}>{title}</Text>
                </View>
                <View >
                    <Text style={{ color: "gray" }}>{content}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <MySeparator />
                </View>
            </View> : null
    )
}

const DispositionCreateForm = ({
    onDraft,
    onSave,
    onDownloadIncoming,
    isRefresh,
    setIsRefresh,
    incomingMailId,
    dispoType
}) => {
    const navigation = useNavigation();
    const [modalIncoming, setModalIncoming] = useState(false);
    const [incomingDatas, setIncomingDatas] = useState([]);
    const [assignDatas, setAssignDatas] = useState([]);
    const [modalAssign, setModalAssign] = useState(false);
    const [itemIncoming, setItemIncoming] = useState({});
    const [showPanelIncoming, setShowPanelIncoming] = useState(false);
    const [incomingDatasBackup, setIncomingDatasBackup] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchIncomingText, setSearchIncomingText] = useState("");

    const [structureAssignDatas, setStructureAssignDatas] = useState([]);
    const [structureAssignId, setStructureAssignId] = useState("");
    const [employeeAssignDatas, setEmployeeAssignDatas] = useState([]);
    const [employeeAssignId, setEmployeeAssignId] = useState("");
    const [classDispoAssignDatas, setClassDipsoAssignDatas] = useState([]);
    const [classDispoAssignId, setClassDispoAssignId] = useState("");


    const searchIncomingRef = useRef(null);
    const descRef = useRef("");
    const incomingRef = useRef("");

    useEffect(() => {
        if (isRefresh) {
            incomingRef.current.setValue("");
            descRef.current.setValue("");
            setShowPanelIncoming(false);
            setItemIncoming({});
            setAssignDatas([]);
            setIsRefresh(false);
        }
    }, [isRefresh, setIsRefresh]);

    useEffect(() => {
        if (incomingMailId) {
            setIncomingMail(incomingMailId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomingMailId]);

    const getIncomingMail = async () => {
        setLoading(true);
        try {
            let apiSelectIncoming = 'incoming-mails/select/data';
            if (dispoType === 'redisposition') {
                apiSelectIncoming = 'incoming-mails/select/data-redispo';
            }
            const result = await apiGet(apiSelectIncoming);
            let _data = result.data ? result.data.map(item => ({
                id: item.id,
                subject_letter: item.subject_letter.charAt(0) === " " ? item.subject_letter.replace(" ", "") : item.subject_letter,
                number_letter: item.number_letter
            })) : [];
            setIncomingDatas(_data);
            setIncomingDatasBackup(_data);
            setLoading(false);
            setModalIncoming(true);
            setTimeout(() => {
                searchIncomingRef.current.focus();
            }, 100)
        } catch (error) {
            setIncomingDatas([]);
            setLoading(false);
            myError(error, navigation);
        }
    }

    const setIncomingMail = async (_id) => {
        try {
            setLoading(true);
            const result = await apiGet("incoming-mails/" + _id);
            let _data = result.data;
            _data.type_name = _data.type ? _data.type.name : "";
            _data.classification_name = _data.classification ? _data.classification.name : "";
            _data.structure_name = _data.structure ? _data.structure.name : "";
            _data.employee_name = _data.to_employee ? _data.to_employee.name : "";
            _data.attachments = _data.attachments ? _data.attachments : [];
            setItemIncoming(_data);
            incomingRef.current.setValue(_data.subject_letter);
            setShowPanelIncoming(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            myError(error, navigation);
        }
    }

    const onSelectIncomingMail = async (_id) => {
        try {
            setLoading(true);
            const result = await apiGet("incoming-mails/" + _id);
            let _data = result.data;
            _data.type_name = _data.type ? _data.type.name : "";
            _data.classification_name = _data.classification ? _data.classification.name : "";
            _data.structure_name = _data.structure ? _data.structure.name : "";
            _data.employee_name = _data.to_employee ? _data.to_employee.name : "";
            _data.attachments = _data.attachments ? _data.attachments : [];
            setSearchIncomingText("");
            setIncomingDatas(incomingDatasBackup);
            setModalIncoming(false);
            incomingRef.current.setValue(_data.subject_letter);
            setItemIncoming(_data);
            setShowPanelIncoming(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            myError(error, navigation);
        }
    }

    const initAssignData = async () => {
        setLoading(true);
        try {
            let [
                _resultStructure,
                _resultClassDispo,
            ] = await Promise.all([
                apiGet("organizations/select/disposition"),
                apiGet("class-dispositions/select/data"),
            ]);
            let _structure = _resultStructure.data.map(item => ({
                id: item.id,
                name: item.kode_struktur + " - " + item.nama_struktur,
                parent_id: item.parent_id
            }));
            setStructureAssignDatas(_structure);
            setClassDipsoAssignDatas(_resultClassDispo.data);
            setLoading(false);
            setModalAssign(true);
        } catch (error) {
            setLoading(false);
            myError(error, navigation);
        }
    }

    const initAssignEmployeeData = async (id_structure) => {
        setLoading(true);
        try {
            let result = await apiGet("employees/select/data-structure/" + id_structure);
            setEmployeeAssignDatas(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            myError(error, navigation);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: whiteColor }}>
            <MyLoading loading={loading} />
            <MyPanel title="Surat Masuk">
                <TouchableOpacity activeOpacity={0.5} style={{ paddingTop: 5 }} onPress={async () => {
                    if (incomingMailId === null) {
                        setSearchIncomingText("");
                        if (incomingDatasBackup.length === 0) {
                            getIncomingMail();
                        } else {
                            try {
                                setModalIncoming(true);
                                setTimeout(() => {
                                    searchIncomingRef.current.focus();
                                }, 100)
                            } catch (error) {
                                myError(error, navigation);
                            }
                        }
                    }


                }}>
                    <MyInputOutlined
                        ref={incomingRef}
                        editable={false}
                        placeholder="Cari surat masuk"
                        label="Cari surat masuk"
                    />
                </TouchableOpacity>
            </MyPanel>
            {
                showPanelIncoming ?
                    <MyPanelPress
                        title="Detail Surat Masuk"
                        collapsed={false}
                    >
                        <InfoText
                            title="Perihal"
                            content={itemIncoming.subject_letter}
                        />
                        <InfoText
                            title="Nomor"
                            content={itemIncoming.number_letter}
                        />
                        <InfoText
                            title="Tanggal Surat"
                            content={itemIncoming.letter_date}
                        />
                        <InfoText
                            title="Tanggal Retensi"
                            content={itemIncoming.retension_date}
                        />
                        <InfoText
                            title="Tanggal Diterima"
                            content={itemIncoming.recieved_date}
                        />
                        <InfoText
                            title="Pengirim"
                            content={itemIncoming.sender_name}
                        />
                        <InfoText
                            title="Penerima"
                            content={itemIncoming.receiver_name}
                        />
                        <InfoText
                            title="Kepada Pegawai"
                            content={itemIncoming.to_employee.name}
                        />
                        <InfoText
                            title="Divisi"
                            content={itemIncoming.structure.name}
                        />
                        <InfoText
                            title="Jenis Surat"
                            content={itemIncoming.type.name}
                        />
                        <InfoText
                            title="Klasifikasi"
                            content={itemIncoming.classification.name}
                        />
                        <MySimpleButton
                            onPress={() => onDownloadIncoming(itemIncoming.id)}
                            title="Download Dokumen"
                            color={successColor}
                            iconName="cloud-download"
                            padding={10}
                            fontSize={16}
                        />
                    </MyPanelPress> : null
            }


            <MyPanel title="Menugaskan Kepada">
                {
                    assignDatas.length !== 0 &&
                    <View style={{ marginBottom: 16 }}>
                        {
                            assignDatas.map((item, x) => {
                                return (
                                    <ItemAssign
                                        key={x}
                                        employee_name={item.employee_name}
                                        structure_name={item.structure_name}
                                        class_name={item.class_name}
                                        onDelete={() => {
                                            let index = assignDatas.findIndex(o => o.id === item.id);
                                            if (index !== -1) {
                                                const list = assignDatas;
                                                list.splice(index, 1);
                                                setAssignDatas([...list]);
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                    </View>

                }
                <MySimpleButton
                    onPress={() => {
                        if (classDispoAssignDatas.length === 0 || structureAssignDatas.length === 0) {
                            initAssignData();
                        } else {
                            setStructureAssignId("");
                            setEmployeeAssignId("");
                            setEmployeeAssignDatas([]);
                            setClassDispoAssignId("");
                            setModalAssign(true);
                        }
                    }}
                    title="Tambah Menugaskan"
                    color={successColor}
                    iconName="plus"
                    padding={10}
                    fontSize={16}
                />
            </MyPanel>
            <MyPanel title="Catatan Disposisi">
                <MyInputOutlined
                    ref={descRef}
                    multiline={true}
                    placeholder="Masukan catatan"
                    label="Catatan"
                    returnKeyType={"next"}
                />
            </MyPanel>
            <View style={{ justifyContent: "center", padding: 16 }}>
                <Grid>
                    <Col size={48}>
                        <MyButton
                            onPress={() => {
                                if (incomingRef.current.value() === "") {
                                    Alert.alert("Error", "Silahkan pilih surat masuk terlebih dahulu");
                                } else if (assignDatas.length === 0) {
                                    Alert.alert("Error", "Menugaskan tidak boleh kosong atau minimal 1");
                                } else {
                                    let _assigns = assignDatas.map(item => ({
                                        structure_id: item.structure_id,
                                        employee_id: item.employee_id,
                                        classification_disposition_id: item.classification_disposition_id
                                    }))
                                    onDraft({
                                        incoming_mail_id: itemIncoming.id,
                                        subject_disposition: itemIncoming.subject_letter,
                                        description: descRef.current.value(),
                                        assigns: _assigns
                                    });
                                }
                            }}
                            title="Draft"
                            color={warningColor}
                            icon={
                                <AntDesign
                                    name="filetext1"
                                    size={18}
                                    color="white"
                                    style={{ marginRight: 10 }}
                                />
                            }
                        />
                    </Col>
                    <Col size={4}>

                    </Col>
                    <Col size={48}>
                        <MyButton
                            onPress={() => {
                                if (incomingRef.current.value() === "") {
                                    Alert.alert("Error", "Silahkan pilih surat masuk terlebih dahulu");
                                } else if (assignDatas.length === 0) {
                                    Alert.alert("Error", "Menugaskan tidak boleh kosong atau minimal 1");
                                } else {
                                    let _assigns = assignDatas.map(item => ({
                                        structure_id: item.structure_id,
                                        employee_id: item.employee_id,
                                        classification_disposition_id: item.classification_disposition_id
                                    }))
                                    onSave({
                                        incoming_mail_id: itemIncoming.id,
                                        subject_disposition: itemIncoming.subject_letter,
                                        description: descRef.current.value(),
                                        assigns: _assigns
                                    });
                                }
                            }}
                            title="Simpan"
                            color={primaryColor}
                            icon={
                                <AntDesign
                                    name="check"
                                    size={18}
                                    color="white"
                                    style={{ marginRight: 10 }}
                                />
                            }
                        />
                    </Col>
                </Grid>
            </View>
            <Modal
                animationType="slide"
                visible={modalIncoming}
                onRequestClose={() => {
                    setModalIncoming(false)
                }}
            >
                <View style={{ backgroundColor: whiteColor }}>
                    <SearchBar
                        ref={searchIncomingRef}
                        placeholder="Cari surat masuk"
                        lightTheme={true}
                        round={true}
                        onChangeText={search => {
                            setSearchIncomingText(search);
                            let newArray = incomingDatasBackup;
                            let myFilter = newArray.filter(e => e.subject_letter.toLowerCase().indexOf(search.toLowerCase()) >= 0 || e.number_letter.toLowerCase().indexOf(search.toLowerCase()) >= 0);
                            setIncomingDatas(myFilter);
                        }}
                        value={searchIncomingText}
                        platform={Platform.OS}
                        inputContainerStyle={{ elevation: 4 }}
                        leftIconContainerStyle={{ marginLeft: 16 }}
                    />
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={incomingDatas}
                        ItemSeparatorComponent={MySeparator}
                        ListFooterComponent={() => <View style={{ marginBottom: 16 }}></View>}
                        renderItem={({ item }) =>
                            <ItemIncomingMailDisposition
                                subject_letter={item.subject_letter}
                                number_letter={item.number_letter}
                                onPress={() => {
                                    onSelectIncomingMail(item.id)

                                }}
                            />
                        }
                        contentContainerStyle={incomingDatas.length === 0 && styles.centerEmptySet}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={loading ? null : MyEmpty}
                    />
                </View>
            </Modal>
            <Modal
                animationType="slide"
                visible={modalAssign}
                onRequestClose={() => {
                    setModalAssign(false)
                }}
            >
                <View style={{ backgroundColor: whiteColor }}>
                    <MyHeader
                        leftComponent={
                            <TouchableOpacity activeOpacity={0.5} style={{ padding: 4 }} onPress={() => {
                                setModalAssign(false)
                            }}>
                                <MaterialIcons size={22} color="white" name="arrow-back" />
                            </TouchableOpacity>
                        }
                        title="Menugaskan Kepada"
                    />
                    <ScrollView>
                        <View style={{ flex: 1, padding: 10 }}>
                            <Picker
                                mode="dropdown"
                                selectedValue={structureAssignId}
                                onValueChange={(itemValue, itemIndex) => {
                                    if (itemValue !== "") {
                                        initAssignEmployeeData(itemValue);
                                    } else {
                                        setEmployeeAssignDatas([]);
                                    }
                                    setStructureAssignId(itemValue);
                                }}>
                                <Picker.Item label="Pilih Divisi" value="" />
                                {
                                    structureAssignDatas.map((item, x) => {
                                        return (
                                            <Picker.Item key={x} label={item.name} value={item.id} />
                                        )
                                    })
                                }
                            </Picker>
                            <Picker
                                mode="dropdown"
                                selectedValue={employeeAssignId}
                                onValueChange={(itemValue, itemIndex) => {
                                    setEmployeeAssignId(itemValue);
                                }}>
                                <Picker.Item label="Pilih Pegawai" value="" />
                                {
                                    employeeAssignDatas.map((item, x) => {
                                        return (
                                            <Picker.Item key={x} label={item.name} value={item.id} />
                                        )
                                    })
                                }
                            </Picker>
                            <Picker
                                mode="dropdown"
                                selectedValue={classDispoAssignId}
                                onValueChange={(itemValue, itemIndex) => {
                                    setClassDispoAssignId(itemValue);
                                }}>
                                <Picker.Item label="Pilih Klasifikasi" value="" />
                                {
                                    classDispoAssignDatas.map((item, x) => {
                                        return (
                                            <Picker.Item key={x} label={item.name} value={item.id} />
                                        )
                                    })
                                }
                            </Picker>
                            <View style={{ padding: 7, marginTop: 20 }}>
                                <MySimpleButton
                                    onPress={() => {
                                        console.log(structureAssignId)
                                        if (structureAssignId === "") {
                                            Alert.alert("Error", "Divisi tidak boleh kosong");
                                        } else if (employeeAssignId === "") {
                                            Alert.alert("Error", "Pegawai tidak boleh kosong");
                                        } else if (classDispoAssignId === "") {
                                            Alert.alert("Error", "Klasifikasi tidak boleh kosong");
                                        } else {
                                            let _data = assignDatas;
                                            let _structur = structureAssignDatas.find(item => item.id === structureAssignId);
                                            let _employee = employeeAssignDatas.find(item => item.id === employeeAssignId);
                                            let _class = classDispoAssignDatas.find(item => item.id === classDispoAssignId);
                                            _data.push({
                                                id: moment().unix().toString(),
                                                structure_id: _structur.id,
                                                structure_name: _structur.name,
                                                employee_id: _employee.id,
                                                employee_name: _employee.name,
                                                classification_disposition_id: _class.id,
                                                class_name: _class.name
                                            });
                                            setAssignDatas(_data);
                                            setModalAssign(false);
                                        }
                                    }}
                                    title="Ok"
                                    color={primaryColor}
                                    iconName="check"
                                    padding={10}
                                    fontSize={16}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    contentText: {
        color: '#444444',
    },
    contentTextQuote: {
        color: '#444444',
        fontStyle: "italic"
    },
    centerEmptySet: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
})

export default DispositionCreateForm;